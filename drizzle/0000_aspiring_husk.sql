CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"emoji" text NOT NULL,
	"color" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "completed_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"person_id" text NOT NULL,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"points" integer NOT NULL,
	"extra_points" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "task_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"person_name" text NOT NULL,
	"preference" text NOT NULL,
	"points_modifier" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "task_preferences_task_id_person_name_unique" UNIQUE("task_id","person_name")
);
--> statement-breakpoint
CREATE TABLE "task_ratings" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" text NOT NULL,
	"person_name" text NOT NULL,
	"points" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "task_ratings_task_id_person_name_unique" UNIQUE("task_id","person_name")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"points" integer NOT NULL,
	"category_id" text
);
--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;