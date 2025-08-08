-- Add extra_points column to completed_tasks table
-- This allows users to give bonus or penalty points for well/poorly done tasks

ALTER TABLE completed_tasks 
ADD COLUMN extra_points INTEGER DEFAULT 0 NOT NULL;

-- Add comment to explain the column
COMMENT ON COLUMN completed_tasks.extra_points IS 'Extra points given by other users for well done (+) or poorly done (-) tasks';
