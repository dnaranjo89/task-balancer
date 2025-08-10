import { db } from "../db";
import {
  completedTasks,
  tasks,
  taskRatings,
  taskPreferences,
} from "../db/schema";
import { eq, and } from "drizzle-orm";
import type {
  AppState,
  CompletedTask,
  Person,
  TaskWithRatings,
  TaskRating,
  TaskPreference,
} from "../types/tasks";

// Hard-coded people list (could be moved to env variables or DB in the future)
const PEOPLE = ["Alba", "David"];

export async function getState(): Promise<AppState> {
  // Get all tasks with their ratings
  const allTasks = await getTasksWithRatings();

  // Get completed tasks
  const completedTasksData = await db
    .select()
    .from(completedTasks)
    .orderBy(completedTasks.completedAt);

  // Calculate total points for each person
  const people: Person[] = PEOPLE.map((name) => {
    const totalPoints = completedTasksData
      .filter((task) => task.personId === name)
      .reduce((sum, task) => sum + task.points, 0);

    return {
      name,
      totalPoints,
    };
  });

  return {
    people,
    completedTasks: completedTasksData.map((task) => ({
      id: task.id.toString(),
      taskId: task.taskId,
      personName: task.personId,
      taskName:
        allTasks.find((t) => t.id === task.taskId)?.name || "Unknown Task",
      points: task.points,
      extraPoints: task.extraPoints,
      completedAt: task.completedAt,
    })),
    tasks: allTasks,
  };
}

export async function getTasksWithRatings(): Promise<TaskWithRatings[]> {
  const allTasks = await db.select().from(tasks);

  // Get ratings for all tasks
  const tasksWithRatings: TaskWithRatings[] = [];

  for (const task of allTasks) {
    const ratings = await db
      .select()
      .from(taskRatings)
      .where(eq(taskRatings.taskId, task.id));

    const preferences = await db
      .select()
      .from(taskPreferences)
      .where(eq(taskPreferences.taskId, task.id));

    const taskRatingsFormatted: TaskRating[] = ratings.map((rating) => ({
      id: rating.id.toString(),
      taskId: rating.taskId,
      personName: rating.personName,
      points: rating.points,
      createdAt: rating.createdAt,
    }));

    const taskPreferencesFormatted: TaskPreference[] = preferences.map(
      (pref) => ({
        id: pref.id.toString(),
        taskId: pref.taskId,
        personName: pref.personName,
        preference: pref.preference as any,
        pointsModifier: pref.pointsModifier,
        createdAt: pref.createdAt,
      })
    );

    // Calculate base points (average of ratings or default task points)
    const basePoints =
      taskRatingsFormatted.length > 0
        ? Math.round(
            taskRatingsFormatted.reduce(
              (sum, rating) => sum + rating.points,
              0
            ) / taskRatingsFormatted.length
          )
        : task.points;

    // Calculate final points (base points + preferences modifiers)
    const preferencesSum = taskPreferencesFormatted.reduce(
      (sum, pref) => sum + pref.pointsModifier,
      0
    );
    const finalPoints = basePoints + preferencesSum;

    // Calculate average points (for backward compatibility)
    const averagePoints = basePoints;

    tasksWithRatings.push({
      id: task.id,
      name: task.name,
      description: task.description || undefined,
      points: task.points,
      category: task.category,
      ratings: taskRatingsFormatted,
      preferences: taskPreferencesFormatted,
      basePoints,
      finalPoints,
      averagePoints,
    });
  }

  return tasksWithRatings;
}

export async function completeTask(
  personName: string,
  taskId: string,
  taskName: string,
  points: number
): Promise<CompletedTask> {
  const newTask = await db
    .insert(completedTasks)
    .values({
      taskId,
      personId: personName,
      points,
    })
    .returning();

  return {
    id: newTask[0].id.toString(),
    taskId: newTask[0].taskId,
    personName: newTask[0].personId,
    taskName,
    points: newTask[0].points,
    extraPoints: newTask[0].extraPoints,
    completedAt: newTask[0].completedAt,
  };
}

export async function resetData(): Promise<void> {
  await db.delete(completedTasks);
  await db.delete(taskRatings);
}

export async function rateTask(
  taskId: string,
  personName: string,
  points: number
): Promise<TaskRating> {
  // Check if rating already exists for this person and task
  const existingRating = await db
    .select()
    .from(taskRatings)
    .where(
      and(
        eq(taskRatings.taskId, taskId),
        eq(taskRatings.personName, personName)
      )
    );

  if (existingRating.length > 0) {
    // Update existing rating
    const updated = await db
      .update(taskRatings)
      .set({ points, createdAt: new Date() })
      .where(eq(taskRatings.id, existingRating[0].id))
      .returning();

    return {
      id: updated[0].id.toString(),
      taskId: updated[0].taskId,
      personName: updated[0].personName,
      points: updated[0].points,
      createdAt: updated[0].createdAt,
    };
  } else {
    // Create new rating
    const newRating = await db
      .insert(taskRatings)
      .values({
        taskId,
        personName,
        points,
      })
      .returning();

    return {
      id: newRating[0].id.toString(),
      taskId: newRating[0].taskId,
      personName: newRating[0].personName,
      points: newRating[0].points,
      createdAt: newRating[0].createdAt,
    };
  }
}
