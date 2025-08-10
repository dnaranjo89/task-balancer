-- Create categories table
CREATE TABLE "categories" (
  "id" text PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "emoji" text NOT NULL,
  "color" text NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Insert default categories
INSERT INTO "categories" ("id", "name", "emoji", "color") VALUES
  ('salon', 'Salón', '🛋️', 'bg-indigo-50 border-indigo-200'),
  ('cocina', 'Cocina', '🍳', 'bg-orange-50 border-orange-200'),
  ('comida', 'Comida', '🍽️', 'bg-yellow-50 border-yellow-200'),
  ('limpieza', 'Limpieza', '🧹', 'bg-blue-50 border-blue-200'),
  ('ropa', 'Ropa', '👕', 'bg-purple-50 border-purple-200'),
  ('habitacion', 'Habitación', '🛏️', 'bg-pink-50 border-pink-200'),
  ('sin_categoria', 'Sin Categoría', '📝', 'bg-gray-50 border-gray-200');

-- Add new category_id column to tasks table
ALTER TABLE "tasks" ADD COLUMN "category_id" text REFERENCES "categories"("id");

-- Migrate existing category data to use category_id
UPDATE "tasks" SET "category_id" = 
  CASE 
    WHEN "category" = 'salon' THEN 'salon'
    WHEN "category" = 'cocina' THEN 'cocina'
    WHEN "category" = 'comida' THEN 'comida'
    WHEN "category" = 'limpieza' THEN 'limpieza'
    WHEN "category" = 'ropa' THEN 'ropa'
    WHEN "category" = 'habitacion' THEN 'habitacion'
    ELSE 'sin_categoria'
  END;

-- Drop the old category column
ALTER TABLE "tasks" DROP COLUMN "category";
