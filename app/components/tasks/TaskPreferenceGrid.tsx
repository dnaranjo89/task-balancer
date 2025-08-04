import React, { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import { Button } from "../index";
import type { Task } from "../../types/tasks";

interface TaskPreferenceGridProps {
  tasks: Task[];
  personName: string;
}

interface TaskPreference {
  taskId: string;
  personName: string;
  preferenceLevel: number; // 1-5
}

const PREFERENCE_LEVELS = [
  {
    value: 1,
    label: "😫 Odio",
    color: "bg-red-100 border-red-300 text-red-700",
  },
  {
    value: 2,
    label: "😔 No me gusta",
    color: "bg-orange-100 border-orange-300 text-orange-700",
  },
  {
    value: 3,
    label: "😐 Neutral",
    color: "bg-gray-100 border-gray-300 text-gray-700",
  },
  {
    value: 4,
    label: "😊 Me gusta",
    color: "bg-blue-100 border-blue-300 text-blue-700",
  },
  {
    value: 5,
    label: "😍 Me encanta",
    color: "bg-green-100 border-green-300 text-green-700",
  },
];

export function TaskPreferenceGrid({
  tasks,
  personName,
}: TaskPreferenceGridProps) {
  const [preferences, setPreferences] = useState<Record<string, number>>({});
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fetcher = useFetcher();

  // Cargar preferencias existentes
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch(
          `/api/task-preferences?personName=${encodeURIComponent(personName)}`
        );
        if (response.ok) {
          const data = await response.json();
          setPreferences(data.preferences || {});
        }
      } catch (error) {
        console.error("Error loading preferences:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [personName]);

  // Agrupar tareas por categoría
  const tasksByCategory = tasks.reduce(
    (acc, task) => {
      const category = task.category || "Sin categoría";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    },
    {} as Record<string, Task[]>
  );

  const handlePreferenceChange = (taskId: string, preferenceLevel: number) => {
    setPreferences((prev) => ({
      ...prev,
      [taskId]: preferenceLevel,
    }));
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = (preferenceLevel: number) => {
    if (draggedTask) {
      handlePreferenceChange(draggedTask.id, preferenceLevel);
      setDraggedTask(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("personName", personName);
      formData.append("preferences", JSON.stringify(preferences));

      const response = await fetch("/api/task-preferences", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Preferences saved:", result);
        // Podrías mostrar una notificación de éxito aquí
      } else {
        console.error("Error saving preferences");
        // Podrías mostrar una notificación de error aquí
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = Object.keys(preferences).length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Cargando preferencias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Explicación */}
      <div className="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-400">
        <h3 className="font-semibold text-blue-800 mb-2">¿Cómo funciona?</h3>
        <p className="text-blue-700 text-sm">
          Arrastra cada tarea a la columna que mejor represente cuánto te gusta
          hacerla. También puedes hacer clic en las tareas para moverlas entre
          columnas.
        </p>
      </div>

      {/* Grid de preferencias */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {PREFERENCE_LEVELS.map((level) => (
          <PreferenceColumn
            key={level.value}
            level={level}
            tasks={tasks.filter((task) => preferences[task.id] === level.value)}
            onDrop={() => handleDrop(level.value)}
            onDragOver={handleDragOver}
            onTaskClick={(task) => handlePreferenceChange(task.id, level.value)}
          />
        ))}
      </div>

      {/* Tareas sin categorizar */}
      <div className="space-y-6">
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => {
          const unassignedTasks = categoryTasks.filter(
            (task) => !preferences[task.id]
          );

          if (unassignedTasks.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {category}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {unassignedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDragStart={() => handleDragStart(task)}
                    onQuickAssign={(preferenceLevel) =>
                      handlePreferenceChange(task.id, preferenceLevel)
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón para guardar */}
      {hasChanges && (
        <div className="sticky bottom-4 flex justify-center">
          <Button
            onClick={savePreferences}
            variant="primary"
            size="large"
            className="shadow-lg"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </>
            ) : (
              <>
                💾 Guardar Preferencias ({Object.keys(preferences).length}{" "}
                tareas)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

interface PreferenceColumnProps {
  level: (typeof PREFERENCE_LEVELS)[0];
  tasks: Task[];
  onDrop: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onTaskClick: (task: Task) => void;
}

function PreferenceColumn({
  level,
  tasks,
  onDrop,
  onDragOver,
  onTaskClick,
}: PreferenceColumnProps) {
  return (
    <div
      className={`min-h-[200px] p-4 rounded-xl border-2 border-dashed ${level.color}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <div className="text-center mb-4">
        <div className="text-2xl mb-1">{level.label.split(" ")[0]}</div>
        <div className="text-sm font-medium">
          {level.label.split(" ").slice(1).join(" ")}
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick(task)}
            className="p-2 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow text-xs"
          >
            <div className="font-medium truncate">{task.name}</div>
            <div className="text-gray-500">{task.points} pts</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
  onQuickAssign: (preferenceLevel: number) => void;
}

function TaskCard({ task, onDragStart, onQuickAssign }: TaskCardProps) {
  const [showQuickAssign, setShowQuickAssign] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowQuickAssign(true)}
      onMouseLeave={() => setShowQuickAssign(false)}
    >
      <div
        draggable
        onDragStart={onDragStart}
        className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-gray-300 cursor-move transition-all"
      >
        <div className="font-medium text-sm text-gray-800 mb-1">
          {task.name}
        </div>
        <div className="text-xs text-gray-500 mb-2">{task.description}</div>
        <div className="text-xs font-medium text-blue-600">
          {task.points} puntos
        </div>
      </div>

      {/* Quick assign buttons */}
      {showQuickAssign && (
        <div className="absolute top-0 left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
          <div className="text-xs font-medium text-gray-600 mb-2">
            Asignar rápido:
          </div>
          <div className="grid grid-cols-5 gap-1">
            {PREFERENCE_LEVELS.map((level) => (
              <button
                key={level.value}
                onClick={() => onQuickAssign(level.value)}
                className="text-xs p-1 rounded border hover:bg-gray-100"
                title={level.label}
              >
                {level.label.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
