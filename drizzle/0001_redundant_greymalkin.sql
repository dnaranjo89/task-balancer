CREATE TABLE "task_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"person_name" text NOT NULL,
	"points" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"points" integer NOT NULL,
	"category" text NOT NULL
);
