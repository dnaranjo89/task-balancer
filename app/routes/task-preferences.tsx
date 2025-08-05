import type { Route } from "./+types/task-preferences";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { Link, useFetcher } from "react-router";
import { Button } from "../components/Button";
import { useTaskData } from "../hooks/useTaskData";
import { useState, useCallback } from "react";
import { PEOPLE } from "../data/tasks";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  DraggableTask,
  UnassignedTasksList,
  DifficultyBucketsGrid,
  PersonSelector,
  Instructions,
  useDragAndDrop,
} from "../components/task-preferences";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Preferencias de Tareas - Task Balancer" },
    {
      name: "description",
      content: "Configura tus preferencias personales para cada tarea",
    },
  ];
}

export default function TaskPreferences() {
  const { state, loading } = useTaskData();
  const fetcher = useFetcher();
  const [selectedPerson, setSelectedPerson] = useState<string>(PEOPLE[0]);
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Custom hook for drag and drop logic
  const {
    sensors,
    unassignedTasks,
    getTasksByBucket,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  } = useDragAndDrop({
    tasks: state?.tasks,
    selectedPerson,
    preferences,
    setPreferences,
    setActiveId,
    setDraggedTask,
  });

  const handleSubmit = useCallback(() => {
    const formData = new FormData();
    formData.append("action", "set_multiple_preferences");
    formData.append("personName", selectedPerson);
    formData.append("preferences", JSON.stringify(preferences));

    fetcher.submit(formData, {
      method: "post",
      action: "/api/task-preferences",
    });

    setPreferences({});
  }, [selectedPerson, preferences, fetcher]);

  // All hooks must be called before any conditional returns
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Cargando preferencias...
          </h1>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Error</h1>
          <p className="text-xl text-gray-600">
            No se pudieron cargar los datos
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              ¿Qué tan difícil te resulta cada tarea?
            </h1>
            <Link to="/">
              <Button onClick={() => {}} variant="secondary">
                ← Volver al inicio
              </Button>
            </Link>
          </div>

          {/* Person Selection */}
          <PersonSelector
            people={PEOPLE}
            selectedPerson={selectedPerson}
            onPersonChange={setSelectedPerson}
          />

          {/* Instructions */}
          <Instructions />

          {/* Main Content */}
          <div className="space-y-6">
            {/* Unassigned Tasks - Always render to maintain hook consistency */}
            <UnassignedTasksList tasks={unassignedTasks} activeId={activeId} />

            {/* Difficulty Buckets */}
            <DifficultyBucketsGrid
              getTasksByBucket={getTasksByBucket}
              draggedTask={draggedTask}
            />

            {/* All Tasks Classified Message - Only show when no unassigned tasks */}
            {unassignedTasks.length === 0 && (
              <div className="text-center text-gray-500 py-8 bg-white rounded-xl shadow-lg">
                <div className="text-4xl mb-2">✅</div>
                <div className="text-lg font-semibold">
                  ¡Todas las tareas clasificadas!
                </div>
                <div className="text-sm mt-1">
                  Puedes guardar tus preferencias o seguir reorganizando
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          {Object.keys(preferences).length > 0 && (
            <div className="mt-6 text-center">
              <Button
                onClick={handleSubmit}
                variant="primary"
                size="large"
                disabled={fetcher.state === "submitting"}
              >
                {fetcher.state === "submitting"
                  ? "Guardando..."
                  : `Guardar Preferencias de ${selectedPerson}`}
              </Button>
            </div>
          )}

          {/* Success Message */}
          {fetcher.data?.success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg text-green-800 text-center">
              ✅ Preferencias guardadas correctamente
            </div>
          )}
        </div>
      </div>

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="transform rotate-3 scale-105 shadow-2xl">
            <DraggableTask
              task={state.tasks.find((t) => t.id === activeId)!}
              isDragging={false}
              isMobile={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
