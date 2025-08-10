import { CATEGORY_CONFIG } from "./constants";
import type { SelectableTask } from "./types";

interface CategorySummaryProps {
  tasksByCategory: Record<string, SelectableTask[]>;
}

export function CategorySummary({ tasksByCategory }: CategorySummaryProps) {
  return (
    <div className="border-t pt-3 mt-3">
      <div className="text-xs text-gray-600 mb-2">
        Tareas seleccionadas por categoría:
      </div>
      <div className="flex flex-wrap gap-2">
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => {
          const selectedInCategory = categoryTasks.filter(
            (task) => task.selected
          );
          if (selectedInCategory.length === 0) return null;

          // Get category data from the first task in the group
          const firstTask = selectedInCategory[0];
          const categoryData = firstTask?.category;

          // Fallback to constants if no category data from DB
          const categoryConfig = categoryData
            ? {
                emoji: categoryData.emoji,
                label: categoryData.name,
              }
            : CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] ||
              CATEGORY_CONFIG["sin categoría"];

          const categoryPoints = selectedInCategory.reduce(
            (sum, task) => sum + task.finalPoints,
            0
          );

          return (
            <span
              key={category}
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-xs"
            >
              <span>{categoryConfig.emoji}</span>
              <span>{selectedInCategory.length}</span>
              <span className="text-green-600 font-medium">
                +{categoryPoints}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
