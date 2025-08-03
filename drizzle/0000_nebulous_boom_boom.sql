CREATE TABLE "completed_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"person_id" text NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"points" integer NOT NULL
);
