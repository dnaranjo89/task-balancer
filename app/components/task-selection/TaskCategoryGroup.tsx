import { CATEGORY_CONFIG } from "./constants";
import { CategoryHeader } from "./CategoryHeader";
import { SingleTaskButton } from "./SingleTaskButton";
import { SelectableTaskCard } from "./SelectableTaskCard";
import type { SelectableTask, SelectionMode } from "./types";
import type { TaskWithRatings } from "../../types/tasks";

interface TaskCategoryGroupProps {
  category: string;
  categoryTasks: SelectableTask[];
  mode: SelectionMode;
  onToggleCategorySelection: (category: string) => void;
  onToggleTaskSelection: (taskId: string) => void;
  onSubmitSingle: (task: TaskWithRatings) => void;
  isLoading: boolean;
}

export function TaskCategoryGroup({
  category,
  categoryTasks,
  mode,
  onToggleCategorySelection,
  onToggleTaskSelection,
  onSubmitSingle,
  isLoading,
}: TaskCategoryGroupProps) {
  // Get category data from the first task in the group (they should all have the same category)
  const firstTask = categoryTasks[0];
  const categoryData = firstTask?.category;
  
  // Fallback to constants if no category data from DB
  const categoryConfig = categoryData ? {
    emoji: categoryData.emoji,
    label: categoryData.name,
    color: categoryData.color,
  } : (CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] || 
       CATEGORY_CONFIG["sin categoría"]);
  
  const selectedInCategory = categoryTasks.filter(
    (task) => task.selected
  ).length;
  const totalInCategory = categoryTasks.length;

  return (
    <div className={`rounded-xl border-2 p-4 ${categoryConfig.color}`}>
      <CategoryHeader
        category={category}
        categoryConfig={categoryConfig}
        totalInCategory={totalInCategory}
        selectedInCategory={selectedInCategory}
        mode={mode}
        onToggleCategorySelection={onToggleCategorySelection}
      />

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {categoryTasks.map((task) => (
          <div key={task.id}>
            {mode === "single" ? (
              <SingleTaskButton
                task={task}
                onSubmit={onSubmitSingle}
                isLoading={isLoading}
              />
            ) : (
              <SelectableTaskCard
                task={task}
                onToggle={onToggleTaskSelection}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
