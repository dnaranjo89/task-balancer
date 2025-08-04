import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Get the database URL from environment variables
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Create Neon HTTP client for serverless environments
const sql = neon(databaseUrl);

// Create the Drizzle database instance
export const db = drizzle(sql, { schema });

export * from "./schema";
