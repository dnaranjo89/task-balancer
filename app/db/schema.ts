import {
  pgTable,
  text,
  timestamp,
  integer,
  serial,
  unique,
} from "drizzle-orm/pg-core";

export const completedTasks = pgTable("completed_tasks", {
  id: serial("id").primaryKey(),
  taskId: text("task_id").notNull(),
  personId: text("person_id").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
  points: integer("points").notNull(),
  extraPoints: integer("extra_points").default(0).notNull(),
});

// Table for categories
export const categories = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  emoji: text("emoji").notNull(),
  color: text("color").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table for predefined tasks with names, points, description and category
export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  points: integer("points").notNull(),
  categoryId: text("category_id").references(() => categories.id),
});

// Table for task ratings
export const taskRatings = pgTable(
  "task_ratings",
  {
    id: serial("id").primaryKey(),
    taskId: text("task_id").notNull(),
    personName: text("person_name").notNull(),
    points: integer("points").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unq: unique().on(table.taskId, table.personName),
  })
);

export const taskPreferences = pgTable(
  "task_preferences",
  {
    id: serial("id").primaryKey(),
    taskId: text("task_id").notNull(),
    personName: text("person_name").notNull(),
    preference: text("preference").notNull(), // 'odio', 'me_cuesta', 'indiferente', 'no_me_cuesta', 'me_gusta'
    pointsModifier: integer("points_modifier").notNull(), // +10, +5, 0, -5, -10
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    unq: unique().on(table.taskId, table.personName),
  })
);

export type CompletedTask = typeof completedTasks.$inferSelect;
export type NewCompletedTask = typeof completedTasks.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type TaskRow = typeof tasks.$inferSelect;
export type TaskRating = typeof taskRatings.$inferSelect;
export type NewTaskRating = typeof taskRatings.$inferInsert;
export type TaskPreference = typeof taskPreferences.$inferSelect;
export type NewTaskPreference = typeof taskPreferences.$inferInsert;
