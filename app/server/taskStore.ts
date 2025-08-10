import { db, tasks, taskRatings, taskPreferences, completedTasks, categories } from "../db";
import { eq, sql, desc } from "drizzle-orm";
import type {
  AppState,
  CompletedTask,
  Person,
  TaskRating,
  TaskWithRatings,
  TaskPreference,
} from "../types/tasks";
import { PEOPLE } from "../data/tasks";

// Initialize data on startup
async function initializeData() {
  try {
    // Check if tasks table is empty and initialize if needed
    const existingTasks = await db.select().from(tasks).limit(1);
    if (existingTasks.length === 0) {
      console.log(
        "No tasks found in database. Please run the seed script to initialize tasks."
      );
    }
  } catch (error) {
    console.error("Error checking tasks:", error);
  }
}

// Initialize data when module loads
initializeData();

export async function getState(): Promise<AppState> {
  // For people, we need to calculate total points from completed tasks
  const peopleNames = PEOPLE.map((name) => ({ name, totalPoints: 0 }));

  // Get completed tasks to calculate points
  const completedTasksData = await db
    .select()
    .from(completedTasks)
    .orderBy(desc(completedTasks.completedAt));

  // Calculate total points per person (including extra points)
  const peopleMap = new Map(peopleNames.map((p) => [p.name, p.totalPoints]));
  completedTasksData.forEach((task) => {
    peopleMap.set(
      task.personId,
      (peopleMap.get(task.personId) || 0) +
        task.points +
        (task.extraPoints || 0)
    );
  });

  const people: Person[] = Array.from(peopleMap.entries()).map(
    ([name, totalPoints]) => ({
      name,
      totalPoints,
    })
  );

  // Get all tasks with their ratings
  const tasksData = await getTasksWithRatings();

  const formattedCompletedTasks: CompletedTask[] = completedTasksData.map(
    (task) => ({
      id: task.id.toString(),
      taskId: task.taskId,
      personName: task.personId,
      taskName:
        tasksData.find((t) => t.id === task.taskId)?.name || "Unknown Task",
      points: task.points,
      extraPoints: task.extraPoints || 0,
      completedAt: task.completedAt,
    })
  );

  return {
    people,
    completedTasks: formattedCompletedTasks,
    tasks: tasksData,
  };
}

export async function getTasksWithRatings(): Promise<TaskWithRatings[]> {
  // Join tasks with categories
  const allTasks = await db
    .select({
      id: tasks.id,
      name: tasks.name,
      description: tasks.description,
      points: tasks.points,
      categoryId: tasks.categoryId,
      categoryName: categories.name,
      categoryEmoji: categories.emoji,
      categoryColor: categories.color,
      categoryCreatedAt: categories.createdAt,
    })
    .from(tasks)
    .leftJoin(categories, eq(tasks.categoryId, categories.id));

  const tasksWithRatings = await Promise.all(
    allTasks.map(async (task) => {
      // Get ratings for this task
      const ratings = await db
        .select()
        .from(taskRatings)
        .where(eq(taskRatings.taskId, task.id));

      const formattedRatings: TaskRating[] = ratings.map((rating) => ({
        id: rating.id.toString(),
        taskId: rating.taskId,
        personName: rating.personName,
        points: rating.points,
        createdAt: rating.createdAt,
      }));

      // Get preferences for this task
      const preferences = await db
        .select()
        .from(taskPreferences)
        .where(eq(taskPreferences.taskId, task.id));

      const formattedPreferences: TaskPreference[] = preferences.map(
        (pref) => ({
          id: pref.id.toString(),
          taskId: pref.taskId,
          personName: pref.personName,
          preference: pref.preference as
            | "odio"
            | "me_cuesta"
            | "indiferente"
            | "no_me_cuesta"
            | "me_gusta",
          pointsModifier: pref.pointsModifier,
          createdAt: pref.createdAt,
        })
      );

      // Calculate base points (average of ratings or default 25)
      const basePoints =
        formattedRatings.length > 0
          ? Math.round(
              formattedRatings.reduce((sum, rating) => sum + rating.points, 0) /
                formattedRatings.length
            )
          : 25; // Default base points

      // Calculate final points (base + sum of preferences)
      const preferencesSum = formattedPreferences.reduce(
        (sum, pref) => sum + pref.pointsModifier,
        0
      );
      const finalPoints = Math.max(1, basePoints + preferencesSum); // Minimum 1 point

      // Build category object if it exists
      const category = task.categoryId && task.categoryName ? {
        id: task.categoryId,
        name: task.categoryName,
        emoji: task.categoryEmoji!,
        color: task.categoryColor!,
        createdAt: task.categoryCreatedAt!,
      } : undefined;

      return {
        id: task.id,
        name: task.name,
        description: task.description || "",
        categoryId: task.categoryId || undefined,
        category,
        points: finalPoints,
        ratings: formattedRatings,
        preferences: formattedPreferences,
        basePoints,
        finalPoints,
        averagePoints: finalPoints, // For backwards compatibility
      };
    })
  );

  return tasksWithRatings;
}

export async function rateTask(
  taskId: string,
  personName: string,
  points: number
): Promise<TaskRating> {
  const result = await db
    .insert(taskRatings)
    .values({
      taskId,
      personName,
      points,
    })
    .onConflictDoUpdate({
      target: [taskRatings.taskId, taskRatings.personName],
      set: {
        points,
        createdAt: sql`NOW()`,
      },
    })
    .returning();

  return {
    id: result[0].id.toString(),
    taskId: result[0].taskId,
    personName: result[0].personName,
    points: result[0].points,
    createdAt: result[0].createdAt,
  };
}

export async function setTaskPreference(
  taskId: string,
  personName: string,
  preference: "odio" | "me_cuesta" | "indiferente" | "no_me_cuesta" | "me_gusta"
): Promise<TaskPreference> {
  // Map preference to points modifier
  const pointsModifier = {
    odio: 10,
    me_cuesta: 5,
    indiferente: 0,
    no_me_cuesta: -5,
    me_gusta: -10,
  }[preference];

  const result = await db
    .insert(taskPreferences)
    .values({
      taskId,
      personName,
      preference,
      pointsModifier,
    })
    .onConflictDoUpdate({
      target: [taskPreferences.taskId, taskPreferences.personName],
      set: {
        preference,
        pointsModifier,
        createdAt: sql`NOW()`,
      },
    })
    .returning();

  return {
    id: result[0].id.toString(),
    taskId: result[0].taskId,
    personName: result[0].personName,
    preference: result[0].preference as
      | "odio"
      | "me_cuesta"
      | "indiferente"
      | "no_me_cuesta"
      | "me_gusta",
    pointsModifier: result[0].pointsModifier,
    createdAt: result[0].createdAt,
  };
}

export async function completeTask(
  personName: string,
  taskId: string,
  taskName: string,
  points: number
): Promise<CompletedTask> {
  const result = await db
    .insert(completedTasks)
    .values({
      taskId,
      personId: personName,
      points,
    })
    .returning();

  return {
    id: result[0].id.toString(),
    taskId: result[0].taskId,
    personName: result[0].personId,
    taskName,
    points: result[0].points,
    extraPoints: result[0].extraPoints || 0,
    completedAt: result[0].completedAt,
  };
}

export async function resetData(): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(completedTasks);
    await tx.delete(taskRatings);
    await tx.delete(taskPreferences);
  });
}
