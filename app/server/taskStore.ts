import Database from "better-sqlite3";
import type { AppState, CompletedTask, Person, TaskRating, TaskWithRatings } from "../types/tasks";
import { PEOPLE, TASKS } from "../data/tasks";

// Initialize SQLite database
const dbPath = process.env.DATABASE_PATH || "./data/tasks.db";
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    name TEXT PRIMARY KEY,
    total_points INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    default_points INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS task_ratings (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    person_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (task_id) REFERENCES tasks (id),
    FOREIGN KEY (person_name) REFERENCES people (name),
    UNIQUE(task_id, person_name)
  );

  CREATE TABLE IF NOT EXISTS completed_tasks (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    person_name TEXT NOT NULL,
    task_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    completed_at TEXT NOT NULL,
    FOREIGN KEY (person_name) REFERENCES people (name),
    FOREIGN KEY (task_id) REFERENCES tasks (id)
  );
`);

// Initialize people if table is empty
const peopleCount = db
  .prepare("SELECT COUNT(*) as count FROM people")
  .get() as { count: number };
if (peopleCount.count === 0) {
  const insertPerson = db.prepare(
    "INSERT INTO people (name, total_points) VALUES (?, ?)"
  );
  PEOPLE.forEach((name) => {
    insertPerson.run(name, 0);
  });
}

// Initialize tasks if table is empty
const tasksCount = db
  .prepare("SELECT COUNT(*) as count FROM tasks")
  .get() as { count: number };
if (tasksCount.count === 0) {
  const insertTask = db.prepare(
    "INSERT INTO tasks (id, name, description, category, default_points) VALUES (?, ?, ?, ?, ?)"
  );
  TASKS.forEach((task) => {
    insertTask.run(task.id, task.name, task.description || '', task.category || '', task.points);
  });
}

export function getState(): AppState {
  const people = db
    .prepare("SELECT name, total_points as totalPoints FROM people")
    .all() as Person[];
  const completedTasks = db
    .prepare(
      `
    SELECT id, task_id as taskId, person_name as personName, task_name as taskName, 
           points, completed_at as completedAt 
    FROM completed_tasks 
    ORDER BY completed_at DESC
  `
    )
    .all() as Array<
    Omit<CompletedTask, "completedAt"> & { completedAt: string }
  >;

  // Get all tasks with their ratings
  const tasks = getTasksWithRatings();

  return {
    people,
    completedTasks: completedTasks.map((task) => ({
      ...task,
      completedAt: new Date(task.completedAt),
    })),
    tasks,
  };
}

export function getTasksWithRatings(): TaskWithRatings[] {
  const tasks = db
    .prepare(`
      SELECT id, name, description, category, default_points as defaultPoints 
      FROM tasks
    `)
    .all() as Array<{
      id: string;
      name: string;
      description: string;
      category: string;
      defaultPoints: number;
    }>;

  return tasks.map((task) => {
    const ratings = db
      .prepare(`
        SELECT id, task_id as taskId, person_name as personName, points, created_at as createdAt
        FROM task_ratings 
        WHERE task_id = ?
      `)
      .all(task.id) as Array<Omit<TaskRating, 'createdAt'> & { createdAt: string }>;

    const formattedRatings = ratings.map((rating) => ({
      ...rating,
      createdAt: new Date(rating.createdAt),
    }));

    // Calculate average points
    const averagePoints = formattedRatings.length > 0 
      ? Math.round(formattedRatings.reduce((sum, rating) => sum + rating.points, 0) / formattedRatings.length)
      : task.defaultPoints;

    return {
      id: task.id,
      name: task.name,
      description: task.description,
      category: task.category,
      points: averagePoints,
      ratings: formattedRatings,
      averagePoints,
    };
  });
}

export function rateTask(taskId: string, personName: string, points: number): TaskRating {
  const ratingId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date();

  const insertOrUpdateRating = db.prepare(`
    INSERT OR REPLACE INTO task_ratings (id, task_id, person_name, points, created_at)
    VALUES (?, ?, ?, ?, ?)
  `);

  insertOrUpdateRating.run(ratingId, taskId, personName, points, createdAt.toISOString());

  return {
    id: ratingId,
    taskId,
    personName,
    points,
    createdAt,
  };
}

export function completeTask(
  personName: string,
  taskId: string,
  taskName: string,
  points: number
): CompletedTask {
  const newCompletedTask: CompletedTask = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    personName,
    taskName,
    points,
    completedAt: new Date(),
  };

  // Start transaction
  const updatePerson = db.prepare(
    "UPDATE people SET total_points = total_points + ? WHERE name = ?"
  );
  const insertTask = db.prepare(`
    INSERT INTO completed_tasks (id, task_id, person_name, task_name, points, completed_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const transaction = db.transaction(() => {
    updatePerson.run(points, personName);
    insertTask.run(
      newCompletedTask.id,
      newCompletedTask.taskId,
      newCompletedTask.personName,
      newCompletedTask.taskName,
      newCompletedTask.points,
      newCompletedTask.completedAt.toISOString()
    );
  });

  transaction();

  return newCompletedTask;
}

export function resetData(): void {
  const transaction = db.transaction(() => {
    db.exec("DELETE FROM completed_tasks");
    db.exec("DELETE FROM task_ratings");
    db.exec("UPDATE people SET total_points = 0");
  });

  transaction();
}

// Graceful shutdown
process.on("SIGINT", () => {
  db.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  db.close();
  process.exit(0);
});
