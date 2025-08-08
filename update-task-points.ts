import dotenv from "dotenv";
import { eq } from "drizzle-orm";
import { db } from "./app/db";
import { tasks } from "./app/db/schema";
import { INITIAL_TASKS } from "./initial-tasks";

// Load environment variables
dotenv.config();

async function updateTaskPoints() {
  console.log("Updating task points to 25 for all tasks...");

  for (const task of INITIAL_TASKS) {
    try {
      const result = await db
        .update(tasks)
        .set({ points: task.points })
        .where(eq(tasks.id, task.id));

      console.log(`Updated task: ${task.name} to ${task.points} points`);
    } catch (error) {
      console.error(`Failed to update task ${task.name}:`, error);
    }
  }

  console.log("Task points update completed.");
  process.exit(0);
}

updateTaskPoints().catch((err) => {
  console.error("Update failed:", err);
  process.exit(1);
});
