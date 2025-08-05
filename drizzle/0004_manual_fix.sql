-- First add the column as nullable
ALTER TABLE "task_preferences" ADD COLUMN "points_modifier" integer;

-- Update existing rows with default values based on preference_level (which is currently stored in preference column)
UPDATE "task_preferences" 
SET "points_modifier" = CASE 
  WHEN "preference" = 1 THEN 10   -- odio (was preference_level 1)
  WHEN "preference" = 2 THEN 5    -- me_cuesta (was preference_level 2) 
  WHEN "preference" = 3 THEN 0    -- indiferente (was preference_level 3)
  WHEN "preference" = 4 THEN -5   -- no_me_cuesta (was preference_level 4)
  WHEN "preference" = 5 THEN -10  -- me_gusta (was preference_level 5)
  ELSE 0
END;

-- Now make the column NOT NULL
ALTER TABLE "task_preferences" ALTER COLUMN "points_modifier" SET NOT NULL;

-- Change the preference column to text and update values
ALTER TABLE "task_preferences" ALTER COLUMN "preference" TYPE text USING CASE 
  WHEN "preference" = 1 THEN 'odio'
  WHEN "preference" = 2 THEN 'me_cuesta'
  WHEN "preference" = 3 THEN 'indiferente'
  WHEN "preference" = 4 THEN 'no_me_cuesta'
  WHEN "preference" = 5 THEN 'me_gusta'
  ELSE 'indiferente'
END;

-- Drop the updated_at column
ALTER TABLE "task_preferences" DROP COLUMN IF EXISTS "updated_at";
