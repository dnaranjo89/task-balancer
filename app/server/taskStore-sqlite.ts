import Database from "better-sqlite3";
import type { AppState, CompletedTask, Person } from "../types/tasks";
import { PEOPLE } from "../data/tasks";

// Initialize SQLite database
const dbPath = process.env.DATABASE_PATH || "./data/tasks.db";
const db = new Database(dbPath);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS people (
    name TEXT PRIMARY KEY,
    total_points INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS completed_tasks (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    person_name TEXT NOT NULL,
    task_name TEXT NOT NULL,
    points INTEGER NOT NULL,
    completed_at TEXT NOT NULL,
    FOREIGN KEY (person_name) REFERENCES people (name)
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

  return {
    people,
    completedTasks: completedTasks.map((task) => ({
      ...task,
      completedAt: new Date(task.completedAt),
    })),
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
