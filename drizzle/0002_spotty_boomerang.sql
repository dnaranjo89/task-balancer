CREATE TABLE "task_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"person_name" text NOT NULL,
	"preference_level" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
