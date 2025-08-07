import type { Route } from "./+types/task-preferences";
import { Link, useFetcher } from "react-router";
import { Button } from "../components/Button";
import { useTaskData } from "../hooks/useTaskData";
import { useState, useEffect } from "react";
import { PEOPLE } from "../data/tasks";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  DraggableTask,
  UnassignedTasksList,
  DifficultyBucketsGrid,
  PersonSelector,
  Instructions,
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
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [selectedPerson, setSelectedPerson] = useState<string>(PEOPLE[0]);
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  // Optimized sensors for mobile scroll compatibility
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 10,
      },
    })
  );

  // Get current preferences for selected person
  const currentPreferences =
    state?.tasks.reduce(
      (acc, task) => {
        const userPref = task.preferences.find(
          (p) => p.personName === selectedPerson
        );
        if (userPref) {
          acc[task.id] = userPref.preference;
        }
        return acc;
      },
      {} as Record<string, string>
    ) ?? {};

  // Combine current and temporary preferences
  const allPreferences = { ...currentPreferences, ...preferences };

  // Get unassigned tasks
  const unassignedTasks =
    state?.tasks.filter((task) => !allPreferences[task.id]) ?? [];

  // Get tasks by bucket
  const getTasksByBucket = (bucketValue: string) => {
    return (
      state?.tasks.filter((task) => allPreferences[task.id] === bucketValue) ??
      []
    );
  };

  // Handle fetcher response (success or error)
  useEffect(() => {
    if (fetcher.state === "idle") {
      if (fetcher.data?.success) {
        showSuccess("Preferencia guardada correctamente");
      } else if (fetcher.data !== undefined) {
        // Handle error response from server
        const errorMessage = fetcher.data?.error || "Error al guardar la preferencia";
        showError(errorMessage);
        console.error("Error saving preference:", fetcher.data);
      }
    }
    
    // Handle network/submission errors
    if (fetcher.state === "idle" && fetcher.data === undefined && preferences && Object.keys(preferences).length > 0) {
      // This might indicate a network error or other submission problem
      showError("Error de conexión. Intenta de nuevo.");
    }
  }, [fetcher.state, fetcher.data, showSuccess, showError, preferences]);

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
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          // Update local state immediately for UI responsiveness
          setPreferences((prev) => ({
            ...prev,
            [active.id as string]: over.id as string,
          }));

          // Save to database immediately
          const formData = new FormData();
          formData.append("action", "set_multiple_preferences");
          formData.append("personName", selectedPerson);
          formData.append("preferences", JSON.stringify({
            [active.id as string]: over.id as string,
          }));

          console.log("Auto-saving preference:", {
            taskId: active.id,
            preference: over.id,
            person: selectedPerson
          });

          fetcher.submit(formData, {
            method: "post",
            action: "/api/task-preferences",
          });
        }
        setActiveId(null);
      }}
      onDragCancel={() => setActiveId(null)}
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
              draggedTask={activeId}
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
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />

      {/* Drag Overlay */}
      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="transform rotate-3 scale-105 shadow-2xl">
            <DraggableTask
              task={state.tasks.find((t) => t.id === activeId)!}
              // isDragging={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
