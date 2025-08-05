import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Load environment variables
dotenv.config();

// Centralized function to get database URL and validate it
export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  return databaseUrl;
}

// Create Neon SQL client
export function createNeonClient() {
  return neon(getDatabaseUrl());
}

// Create Drizzle database instance
export function createDatabase() {
  const sql = createNeonClient();
  return drizzle(sql, { schema });
}

// Default database instance for app usage
export const db = createDatabase();

export * from "./schema";
