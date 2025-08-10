import { createNeonClient, db } from "./app/db";
import { tasks, categories } from "./app/db/schema";
import { INITIAL_TASKS } from "./initial-tasks";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initial categories for seeding the database
const INITIAL_CATEGORIES = [
  {
    id: "salon",
    name: "Salón",
    emoji: "🛋️",
    color: "bg-indigo-50 border-indigo-200",
  },
  {
    id: "cocina",
    name: "Cocina",
    emoji: "🍳",
    color: "bg-orange-50 border-orange-200",
  },
  {
    id: "comida",
    name: "Comida",
    emoji: "🍽️",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: "limpieza",
    name: "Limpieza",
    emoji: "🧹",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: "ropa",
    name: "Ropa",
    emoji: "👕",
    color: "bg-purple-50 border-purple-200",
  },
  {
    id: "habitacion",
    name: "Habitación",
    emoji: "🛏️",
    color: "bg-pink-50 border-pink-200",
  },
  {
    id: "sin_categoria",
    name: "Sin Categoría",
    emoji: "📝",
    color: "bg-gray-50 border-gray-200",
  },
];

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
    await sql`DROP TABLE IF EXISTS categories CASCADE`;

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

    // Insert initial categories first
    console.log("  - Seeding categories...");
    for (const category of INITIAL_CATEGORIES) {
      await db.insert(categories).values({
        id: category.id,
        name: category.name,
        emoji: category.emoji,
        color: category.color,
      });
      console.log(`    - Inserted category: ${category.name} ${category.emoji}`);
    }

    // Insert initial tasks using the same source as the app
    console.log("  - Seeding tasks...");
    for (const task of INITIAL_TASKS) {
      await db.insert(tasks).values({
        id: task.id,
        name: task.name,
        description: task.description || "",
        points: task.points,
        categoryId: task.categoryId || null,
      });
      console.log(`    - Inserted task: ${task.name}`);
    }

    console.log("✅ Initial data seeded successfully");

    console.log("🎉 Database reset completed successfully!");
    console.log("📋 Summary:");
    console.log("  - Old migration files cleaned up");
    console.log("  - All old tables dropped");
    console.log("  - Fresh schema created via Drizzle migrations");
    console.log(`  - ${INITIAL_CATEGORIES.length} categories seeded`);
    console.log(`  - ${INITIAL_TASKS.length} initial tasks seeded`);
    console.log("  - Drizzle migrations properly initialized");
    console.log("  - Ready for use!");
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    process.exit(1);
  }
}

resetDatabase();
