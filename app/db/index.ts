import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Create the Drizzle database instance
export const db = drizzle(pool, { schema });

export * from "./schema";
