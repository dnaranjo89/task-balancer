ALTER TABLE "task_preferences" RENAME COLUMN "preference_level" TO "preference";--> statement-breakpoint
ALTER TABLE "task_preferences" ADD COLUMN "points_modifier" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "task_preferences" DROP COLUMN "updated_at";