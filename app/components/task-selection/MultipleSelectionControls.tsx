import { Button } from "../Button";
import { CategorySummary } from "./CategorySummary";
import type { SelectableTask } from "./types";

interface MultipleSelectionControlsProps {
  selectableTasks: SelectableTask[];
  selectedTasks: SelectableTask[];
  totalPoints: number;
  tasksByCategory: Record<string, SelectableTask[]>;
  onToggleSelectAll: () => void;
  onSubmitMultiple: () => void;
  isLoading: boolean;
}

export function MultipleSelectionControls({
  selectableTasks,
  selectedTasks,
  totalPoints,
  tasksByCategory,
  onToggleSelectAll,
  onSubmitMultiple,
  isLoading,
}: MultipleSelectionControlsProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSelectAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            {selectableTasks.every((task) => task.selected)
              ? "❌ Deseleccionar todas"
              : "✅ Seleccionar todas"}
          </button>
          <span className="text-sm text-gray-600">
            {selectedTasks.length} de {selectableTasks.length} tareas
            seleccionadas
          </span>
        </div>
        {selectedTasks.length > 0 && (
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              +{totalPoints} puntos total
            </div>
            <Button
              onClick={onSubmitMultiple}
              disabled={isLoading}
              variant="primary"
              className="mt-2"
            >
              {isLoading
                ? "Completando..."
                : `Completar ${selectedTasks.length} tareas`}
            </Button>
          </div>
        )}
      </div>

      {/* Category Summary */}
      {selectedTasks.length > 0 && (
        <CategorySummary tasksByCategory={tasksByCategory} />
      )}

      {selectedTasks.length === 0 && (
        <div className="text-center py-2">
          <p className="text-sm text-gray-500">
            💡 Haz clic en las tareas que quieres marcar como completadas
          </p>
        </div>
      )}
    </div>
  );
}
