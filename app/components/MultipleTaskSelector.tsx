import { useState, useMemo } from "react";
import { useFetcher } from "react-router";
import { Button } from "./Button";
import type { TaskWithRatings } from "../types/tasks";

interface MultipleTaskSelectorProps {
  tasks: TaskWithRatings[];
  personName: string;
}

interface SelectableTask extends TaskWithRatings {
  selected: boolean;
}

// Category configuration with emojis and colors
const CATEGORY_CONFIG = {
  salon: {
    emoji: "🛋️",
    label: "Salón",
    color: "bg-indigo-50 border-indigo-200",
  },
  cocina: {
    emoji: "🍳",
    label: "Cocina",
    color: "bg-orange-50 border-orange-200",
  },
  comida: {
    emoji: "🍽️",
    label: "Comida",
    color: "bg-yellow-50 border-yellow-200",
  },
  limpieza: {
    emoji: "🧹",
    label: "Limpieza",
    color: "bg-blue-50 border-blue-200",
  },
  ropa: { emoji: "👕", label: "Ropa", color: "bg-purple-50 border-purple-200" },
  habitacion: {
    emoji: "🛏️",
    label: "Habitación",
    color: "bg-pink-50 border-pink-200",
  },
  "sin categoría": {
    emoji: "📝",
    label: "Sin Categoría",
    color: "bg-gray-50 border-gray-200",
  },
};

export function MultipleTaskSelector({
  tasks,
  personName,
}: MultipleTaskSelectorProps) {
  const [selectableTasks, setSelectableTasks] = useState<SelectableTask[]>(
    tasks.map((task) => ({ ...task, selected: false }))
  );
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const fetcher = useFetcher();

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    return selectableTasks.reduce(
      (acc, task) => {
        const category = task.category || "sin categoría";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(task);
        return acc;
      },
      {} as Record<string, SelectableTask[]>
    );
  }, [selectableTasks]);

  const toggleTaskSelection = (taskId: string) => {
    setSelectableTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = selectableTasks.every((task) => task.selected);
    setSelectableTasks((prev) =>
      prev.map((task) => ({ ...task, selected: !allSelected }))
    );
  };

  const toggleCategorySelection = (category: string) => {
    const categoryTasks = tasksByCategory[category];
    const allCategorySelected = categoryTasks.every((task) => task.selected);

    setSelectableTasks((prev) =>
      prev.map((task) =>
        task.category === category ||
        (category === "sin categoría" && !task.category)
          ? { ...task, selected: !allCategorySelected }
          : task
      )
    );
  };

  const selectedTasks = selectableTasks.filter((task) => task.selected);
  const totalPoints = selectedTasks.reduce(
    (sum, task) => sum + task.finalPoints,
    0
  );

  const handleSubmitMultiple = () => {
    if (selectedTasks.length === 0) return;

    const tasksData = selectedTasks.map((task) => ({
      id: task.id,
      name: task.name,
      points: task.finalPoints,
    }));

    fetcher.submit(
      {
        action: "complete-multiple",
        personName,
        tasks: JSON.stringify(tasksData),
      },
      { method: "post", action: "/api/tasks" }
    );
  };

  const handleSubmitSingle = (task: TaskWithRatings) => {
    fetcher.submit(
      {
        action: "complete",
        personName,
        taskId: task.id,
        taskName: task.name,
        points: task.finalPoints.toString(),
      },
      { method: "post", action: "/api/tasks" }
    );
  };

  const isLoading = fetcher.state === "submitting";

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg p-1 shadow-md border">
          <button
            onClick={() => setMode("single")}
            className={`px-6 py-3 rounded-md text-sm font-medium transition-colors ${
              mode === "single"
                ? "bg-green-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            📝 Una tarea
          </button>
          <button
            onClick={() => setMode("multiple")}
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

      {/* Multiple Selection Controls */}
      {mode === "multiple" && (
        <div className="bg-white rounded-lg p-4 shadow-md border">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSelectAll}
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
                  onClick={handleSubmitMultiple}
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
            <div className="border-t pt-3 mt-3">
              <div className="text-xs text-gray-600 mb-2">
                Tareas seleccionadas por categoría:
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(tasksByCategory).map(
                  ([category, categoryTasks]) => {
                    const selectedInCategory = categoryTasks.filter(
                      (task) => task.selected
                    );
                    if (selectedInCategory.length === 0) return null;

                    const categoryConfig =
                      CATEGORY_CONFIG[
                        category as keyof typeof CATEGORY_CONFIG
                      ] || CATEGORY_CONFIG["sin categoría"];
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
                  }
                )}
              </div>
            </div>
          )}

          {selectedTasks.length === 0 && (
            <div className="text-center py-2">
              <p className="text-sm text-gray-500">
                💡 Haz clic en las tareas que quieres marcar como completadas
              </p>
            </div>
          )}
        </div>
      )}

      {/* Task Grid - Grouped by Categories */}
      <div className="space-y-6">
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => {
          const categoryConfig =
            CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG] ||
            CATEGORY_CONFIG["sin categoría"];
          const selectedInCategory = categoryTasks.filter(
            (task) => task.selected
          ).length;
          const totalInCategory = categoryTasks.length;

          return (
            <div
              key={category}
              className={`rounded-xl border-2 p-4 ${categoryConfig.color}`}
            >
              {/* Category Header */}
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
                      onClick={() => toggleCategorySelection(category)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {selectedInCategory === totalInCategory
                        ? "❌ Deseleccionar todas"
                        : "✅ Seleccionar todas"}
                    </button>
                  </div>
                )}
              </div>

              {/* Tasks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryTasks.map((task) => (
                  <div key={task.id}>
                    {mode === "single" ? (
                      // Single mode - original TaskButton behavior
                      <button
                        onClick={() => handleSubmitSingle(task)}
                        disabled={isLoading}
                        className="w-full text-left flex justify-between items-center min-h-16 bg-green-500 hover:bg-green-600 text-white shadow-lg px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50"
                      >
                        <div className="flex-1">
                          <div className="font-bold text-base">{task.name}</div>
                          <div className="text-xs opacity-70 mt-1">
                            Base: {task.basePoints} pts
                            {task.preferences.length > 0 && (
                              <span>
                                {" "}
                                | Con preferencias: {task.finalPoints} pts
                              </span>
                            )}
                            {task.ratings.length > 0 && (
                              <span>
                                {" "}
                                | {task.ratings.length} valoración
                                {task.ratings.length !== 1 ? "es" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-xl font-bold">
                            +{task.finalPoints}
                          </div>
                          <div className="text-xs opacity-70">
                            {task.preferences.length > 0
                              ? "con preferencias"
                              : "puntos base"}
                          </div>
                        </div>
                      </button>
                    ) : (
                      // Multiple mode - selectable card
                      <div
                        onClick={() => toggleTaskSelection(task.id)}
                        className={`cursor-pointer border-2 rounded-lg transition-all duration-200 ${
                          task.selected
                            ? "border-green-500 bg-green-50 shadow-lg scale-105"
                            : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
                        }`}
                      >
                        <div className="p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={task.selected}
                                  onChange={() => toggleTaskSelection(task.id)}
                                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
                                />
                                <div className="font-bold text-base text-gray-800">
                                  {task.name}
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1 ml-6">
                                Base: {task.basePoints} pts
                                {task.preferences.length > 0 && (
                                  <span>
                                    {" "}
                                    | Con preferencias: {task.finalPoints} pts
                                  </span>
                                )}
                                {task.ratings.length > 0 && (
                                  <span>
                                    {" "}
                                    | {task.ratings.length} valoración
                                    {task.ratings.length !== 1 ? "es" : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <div
                                className={`text-xl font-bold ${task.selected ? "text-green-600" : "text-gray-600"}`}
                              >
                                +{task.finalPoints}
                              </div>
                              <div className="text-xs text-gray-500">
                                {task.preferences.length > 0
                                  ? "con preferencias"
                                  : "puntos base"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
