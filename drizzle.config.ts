import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./app/db";

export default defineConfig({
  schema: "./app/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
