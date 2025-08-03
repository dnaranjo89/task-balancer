import { pgTable, text, timestamp, integer, serial } from "drizzle-orm/pg-core";

export const completedTasks = pgTable("completed_tasks", {
  id: serial("id").primaryKey(),
  taskId: text("task_id").notNull(),
  personId: text("person_id").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  points: integer("points").notNull(),
});

export type CompletedTask = typeof completedTasks.$inferSelect;
export type NewCompletedTask = typeof completedTasks.$inferInsert;
