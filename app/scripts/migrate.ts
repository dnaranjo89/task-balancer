import { createDatabase, getDatabaseUrl } from "../db/index";
import { sql } from "drizzle-orm";

async function migrate() {
  const db = createDatabase();
  
  console.log("Adding unique constraints to database...");
  
  try {
    // Add unique constraint to task_ratings if it doesn't exist
    await db.execute(sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'task_ratings_task_id_person_name_unique'
        ) THEN
          ALTER TABLE task_ratings 
          ADD CONSTRAINT task_ratings_task_id_person_name_unique 
          UNIQUE (task_id, person_name);
        END IF;
      END $$;
    `);
    
    // Add unique constraint to task_preferences if it doesn't exist
    await db.execute(sql`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint 
          WHERE conname = 'task_preferences_task_id_person_name_unique'
        ) THEN
          ALTER TABLE task_preferences 
          ADD CONSTRAINT task_preferences_task_id_person_name_unique 
          UNIQUE (task_id, person_name);
        END IF;
      END $$;
    `);
    
    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate()
    .then(() => {
      console.log("Migration script completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Migration script failed:", error);
      process.exit(1);
    });
}

export { migrate };
