import { CATEGORY_CONFIG } from "./constants";
import type { SelectableTask, SelectionMode } from "./types";

interface CategoryHeaderProps {
  category: string;
  categoryConfig: {
    emoji: string;
    label: string;
    color: string;
  };
  totalInCategory: number;
  selectedInCategory: number;
  mode: SelectionMode;
  onToggleCategorySelection: (category: string) => void;
}

export function CategoryHeader({
  category,
  categoryConfig,
  totalInCategory,
  selectedInCategory,
  mode,
  onToggleCategorySelection,
}: CategoryHeaderProps) {

  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
        <span className="text-2xl">{categoryConfig.emoji}</span>
        {categoryConfig.label}
        <span className="text-sm font-normal text-gray-600">
          ({totalInCategory} tarea{totalInCategory !== 1 ? "s" : ""})
        </span>
      </h3>

      {mode === "multiple" && (
        <div className="flex items-center gap-2">
          {selectedInCategory > 0 && (
            <span className="text-sm text-gray-600">
              {selectedInCategory} de {totalInCategory} seleccionadas
            </span>
          )}
          <button
            onClick={() => onToggleCategorySelection(category)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            {selectedInCategory === totalInCategory
              ? "❌ Deseleccionar todas"
              : "✅ Seleccionar todas"}
          </button>
        </div>
      )}
    </div>
  );
}
