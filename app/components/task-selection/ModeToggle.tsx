import type { SelectionMode } from "./types";

interface ModeToggleProps {
  mode: SelectionMode;
  onModeChange: (mode: SelectionMode) => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-lg p-1 shadow-md border">
        <button
          onClick={() => onModeChange("single")}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
            mode === "single"
              ? "bg-green-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          📝 Una tarea
        </button>
        <button
          onClick={() => onModeChange("multiple")}
          className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
            mode === "multiple"
              ? "bg-green-500 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
          }`}
        >
          📋 Múltiples tareas
        </button>
      </div>
    </div>
  );
}
