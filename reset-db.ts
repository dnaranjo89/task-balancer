import { createNeonClient } from "./app/db";

async function resetDatabase() {
  const sql = createNeonClient();

  try {
    console.log("🗑️  Dropping all existing tables...");

    // Drop all tables in correct order (respecting foreign keys)
    await sql`DROP TABLE IF EXISTS completed_tasks CASCADE`;
    await sql`DROP TABLE IF EXISTS task_ratings CASCADE`;
    await sql`DROP TABLE IF EXISTS task_preferences CASCADE`;
    await sql`DROP TABLE IF EXISTS tasks CASCADE`;

    // Also drop the drizzle migrations table to start fresh
    await sql`DROP TABLE IF EXISTS __drizzle_migrations CASCADE`;

    console.log("✅ All tables dropped successfully");

    console.log("🏗️  Creating fresh tables...");

    // Create tasks table
    await sql`
      CREATE TABLE tasks (
        id text PRIMARY KEY,
        name text NOT NULL,
        description text,
        points integer NOT NULL,
        category text NOT NULL
      )
    `;

    // Create task_ratings table
    await sql`
      CREATE TABLE task_ratings (
        id serial PRIMARY KEY,
        task_id text NOT NULL REFERENCES tasks(id),
        person_name text NOT NULL,
        points integer NOT NULL,
        created_at timestamp DEFAULT NOW() NOT NULL,
        UNIQUE(task_id, person_name)
      )
    `;

    // Create task_preferences table with the new schema
    await sql`
      CREATE TABLE task_preferences (
        id serial PRIMARY KEY,
        task_id text NOT NULL REFERENCES tasks(id),
        person_name text NOT NULL,
        preference text NOT NULL CHECK (preference IN ('odio', 'me_cuesta', 'indiferente', 'no_me_cuesta', 'me_gusta')),
        points_modifier integer NOT NULL,
        created_at timestamp DEFAULT NOW() NOT NULL,
        UNIQUE(task_id, person_name)
      )
    `;

    // Create completed_tasks table
    await sql`
      CREATE TABLE completed_tasks (
        id serial PRIMARY KEY,
        task_id text NOT NULL REFERENCES tasks(id),
        person_id text NOT NULL,
        points integer NOT NULL,
        completed_at timestamp DEFAULT NOW() NOT NULL
      )
    `;

    console.log("✅ All tables created successfully");

    console.log("📊 Seeding initial data...");

    // Insert initial tasks (you can modify these as needed)
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
        points: 30,
        category: "limpieza",
      },
      {
        id: "do-laundry",
        name: "Hacer la colada",
        description: "Lavar, tender y doblar la ropa",
        points: 20,
        category: "limpieza",
      },
      {
        id: "grocery-shopping",
        name: "Hacer la compra",
        description: "Comprar comida y productos del hogar",
        points: 35,
        category: "recados",
      },
      {
        id: "cook-dinner",
        name: "Preparar la cena",
        description: "Cocinar una comida completa",
        points: 40,
        category: "cocina",
      },
    ];

    for (const task of initialTasks) {
      await sql`
        INSERT INTO tasks (id, name, description, points, category)
        VALUES (${task.id}, ${task.name}, ${task.description}, ${task.points}, ${task.category})
      `;
    }

    console.log("✅ Initial tasks seeded successfully");

    // Create the drizzle migrations table and mark current state as migrated
    await sql`
      CREATE TABLE __drizzle_migrations (
        id serial PRIMARY KEY,
        hash text NOT NULL,
        created_at bigint
      )
    `;

    // Insert fake migration entries to mark the current schema as "migrated"
    const now = Date.now();
    await sql`
      INSERT INTO __drizzle_migrations (hash, created_at) VALUES 
      ('fresh-reset-' || ${now}, ${now})
    `;

    console.log("🎉 Database reset completed successfully!");
    console.log("📋 Summary:");
    console.log("  - All old tables dropped");
    console.log("  - Fresh schema created with new task_preferences structure");
    console.log(`  - ${initialTasks.length} initial tasks seeded`);
    console.log("  - Ready for use!");
  } catch (error) {
    console.error("❌ Database reset failed:", error);
    process.exit(1);
  }
}

resetDatabase();
