import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";

export const completedTasks = pgTable("completed_tasks", {
  id: serial("id").primaryKey(),
  taskId: text("task_id").notNull(),
  personId: text("person_id").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  points: integer("points").notNull(),
});

// Table for predefined tasks with names, points, description and category
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  points: integer("points").notNull(),
  category: text("category").notNull(),
});

// Table for task ratings
export const taskRatings = pgTable("task_ratings", {
  id: serial("id").primaryKey(),
  taskId: text("task_id").notNull(),
  personName: text("person_name").notNull(),
  points: integer("points").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CompletedTask = typeof completedTasks.$inferSelect;
export type NewCompletedTask = typeof completedTasks.$inferInsert;
export type TaskRow = typeof tasks.$inferSelect;
export type TaskRating = typeof taskRatings.$inferSelect;
export type NewTaskRating = typeof taskRatings.$inferInsert;
