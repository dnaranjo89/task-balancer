import { createNeonClient } from "./app/db";
import * as fs from "fs";

async function runManualMigration() {
  const sql = createNeonClient();

  // Read the manual migration file
  const migrationSQL = fs.readFileSync("./drizzle/0004_manual_fix.sql", "utf8");

  try {
    console.log("Running manual migration...");

    // Split by statement and execute each one
    const statements = migrationSQL.split(";").filter((s) => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.trim().substring(0, 50)}...`);
        await sql`${sql.unsafe(statement.trim())}`;
      }
    }

    console.log("Manual migration completed successfully!");
  } catch (error) {
    console.error("Manual migration failed:", error);
    process.exit(1);
  }
}

runManualMigration();
