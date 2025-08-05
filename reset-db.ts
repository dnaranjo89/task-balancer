import { createNeonClient, db } from "./app/db";
import { tasks } from "./app/db/schema";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resetDatabase() {
  const sql = createNeonClient();

  try {
    console.log("🗑️  Cleaning up old migration files...");

    // Remove old drizzle migration files
    const drizzlePath = path.join(__dirname, "drizzle");
    const metaPath = path.join(drizzlePath, "meta");

    if (fs.existsSync(drizzlePath)) {
      // Remove .sql files
      const sqlFiles = fs
        .readdirSync(drizzlePath)
        .filter((f) => f.endsWith(".sql"));
      sqlFiles.forEach((file) => {
        fs.unlinkSync(path.join(drizzlePath, file));
        console.log(`  - Removed ${file}`);
      });

      // Remove meta files
      if (fs.existsSync(metaPath)) {
        const metaFiles = fs.readdirSync(metaPath);
        metaFiles.forEach((file) => {
          fs.unlinkSync(path.join(metaPath, file));
          console.log(`  - Removed meta/${file}`);
        });
      }
    }

    console.log("✅ Migration files cleaned up");

    console.log("🗑️  Dropping all existing tables...");

    // Drop all tables in correct order (respecting foreign keys)
    await sql`DROP TABLE IF EXISTS completed_tasks CASCADE`;
    await sql`DROP TABLE IF EXISTS task_ratings CASCADE`;
    await sql`DROP TABLE IF EXISTS task_preferences CASCADE`;
    await sql`DROP TABLE IF EXISTS tasks CASCADE`;

    // Drop drizzle migrations table from all possible schemas
    await sql`DROP TABLE IF EXISTS __drizzle_migrations CASCADE`;
    await sql`DROP TABLE IF EXISTS drizzle.__drizzle_migrations CASCADE`;
    await sql`DROP SCHEMA IF EXISTS drizzle CASCADE`;

    console.log("✅ All tables dropped successfully");

    console.log("🔧 Setting up Drizzle migrations...");

    // Recreate drizzle directory structure
    if (!fs.existsSync(drizzlePath)) {
      fs.mkdirSync(drizzlePath, { recursive: true });
    }
    if (!fs.existsSync(metaPath)) {
      fs.mkdirSync(metaPath, { recursive: true });
    }

    // Create minimal _journal.json for drizzle-kit
    const journalPath = path.join(metaPath, "_journal.json");
    fs.writeFileSync(
      journalPath,
      JSON.stringify(
        {
          version: "7",
          dialect: "postgresql",
          entries: [],
        },
        null,
        2
      )
    );

    // Generate initial migration based on current schema
    console.log("  - Generating migration files...");
    execSync("npm run db:generate", { stdio: "inherit" });

    // Apply the migration (this creates all tables and __drizzle_migrations properly)
    console.log("  - Applying migrations...");
    execSync("npm run db:migrate", { stdio: "inherit" });

    console.log("📊 Seeding initial data...");

    // Insert initial tasks using Drizzle ORM
    const initialTasks = [
      {
        id: "clean-kitchen",
        name: "Limpiar la cocina",
        description: "Lavar platos, limpiar encimeras y barrer",
        points: 25,
        category: "limpieza",
      },
      {
        id: "vacuum-house",
        name: "Aspirar la casa",
        description: "Aspirar todas las habitaciones",
        points: 25,
        category: "limpieza",
      },
      {
        id: "do-laundry",
        name: "Hacer la colada",
        description: "Lavar, tender y doblar la ropa",
        points: 25,
        category: "limpieza",
      },
      {
        id: "grocery-shopping",
        name: "Hacer la compra",
        description: "Comprar comida y productos del hogar",
        points: 25,
        category: "recados",
      },
      {
        id: "cook-dinner",
        name: "Preparar la cena",
        description: "Cocinar una comida completa",
        points: 25,
        category: "cocina",
      },
    ];

    for (const task of initialTasks) {
      await db.insert(tasks).values(task);
      console.log(`  - Inserted task: ${task.name}`);
    }

    console.log("✅ Initial tasks seeded successfully");

    console.log("🎉 Database reset completed successfully!");
    console.log("📋 Summary:");
    console.log("  - Old migration files cleaned up");
    console.log("  - All old tables dropped");
    console.log("  - Fresh schema created via Drizzle migrations");
    console.log(`  - ${initialTasks.length} initial tasks seeded`);
    console.log("  - Drizzle migrations properly initialized");
    console.log("  - Ready for use!");
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    process.exit(1);
  }
}

resetDatabase();
