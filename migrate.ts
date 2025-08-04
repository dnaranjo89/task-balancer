import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "./app/db";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function runMigrations() {
  console.log("Running migrations...");

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigrations();
