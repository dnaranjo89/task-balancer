import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";

export const completedTasks = pgTable("completed_tasks", {
  id: serial("id").primaryKey(),
  taskId: text("task_id").notNull(),
  personId: text("person_id").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  points: integer("points").notNull(),
});
// Table for predefined tasks with names, points and category
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  points: integer("points").notNull(),
  category: text("category").notNull(),
});

export type CompletedTask = typeof completedTasks.$inferSelect;
export type NewCompletedTask = typeof completedTasks.$inferInsert;
export type TaskRow = typeof tasks.$inferSelect;
