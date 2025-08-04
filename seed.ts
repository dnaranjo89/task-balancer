import dotenv from "dotenv";
import { db } from "./app/db";
import { tasks } from "./app/db/schema";
import { TASKS } from "./app/data/tasks";

// Load environment variables
dotenv.config();

async function seedTasks() {
  console.log("Seeding tasks into database...");
  for (const task of TASKS) {
    await db
      .insert(tasks)
      .values({
        id: task.id,
        name: task.name,
        points: task.points,
        category: task.category,
      });
    console.log(`Inserted task: ${task.name}`);
  }
  console.log("Seeding completed.");
  process.exit(0);
}

seedTasks().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
