import type { Route } from "./+types/task-preferences";
import { Link, useFetcher } from "react-router";
import { Button } from "../components/Button";
import { useTaskData } from "../hooks/useTaskData";
import { useState, useEffect } from "react";
import { PEOPLE } from "../data/tasks";
import { useToast } from "../hooks/useToast";
import { ToastContainer, LoadingState, ErrorState } from "../components";
import { setTaskPreference } from "../server/taskStore";
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

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const personName = formData.get("personName") as string;
  const taskId = formData.get("taskId") as string;
  const preference = formData.get("preference") as string;
  const action = formData.get("action") as string;

  if (!personName || !taskId) {
    return {
      success: false,
      error: "Faltan datos requeridos",
    };
  }

  try {
    if (action === "remove_preference") {
      // Eliminar preferencia (desclasificar tarea)
      // Aquí necesitarías una función para eliminar la preferencia
      // Por ahora, guardaremos como "indiferente" que es neutral
      await setTaskPreference(taskId, personName, "indiferente");

      return {
        success: true,
        message: "Tarea desclasificada",
      };
    } else {
      // Guardar preferencia normal
      if (!preference) {
        return {
          success: false,
          error: "Falta la preferencia",
        };
      }

      await setTaskPreference(
        taskId,
        personName,
        preference as
          | "odio"
          | "me_cuesta"
          | "indiferente"
          | "no_me_cuesta"
          | "me_gusta"
      );

      return {
        success: true,
        message: "Preferencia guardada correctamente",
      };
    }
  } catch (error) {
    console.error("Error processing preference:", error);
    return {
      success: false,
      error: "Error al procesar la preferencia",
    };
  }
}

export default function TaskPreferences() {
  const { state, loading } = useTaskData();
  const fetcher = useFetcher<typeof action>();
  const { toasts, showSuccess, showError, removeToast } = useToast();
  const [selectedPerson, setSelectedPerson] = useState<string>(PEOPLE[0]);
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  // Clear temporary preferences when person changes
  useEffect(() => {
    setPreferences({});
  }, [selectedPerson]);

  // Handle fetcher result
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.success) {
        showSuccess(
          fetcher.data.message || "Preferencia guardada correctamente"
        );
      } else {
        showError(fetcher.data.error || "Error al guardar la preferencia");
      }
    }
  }, [fetcher.state, fetcher.data, showSuccess, showError]);

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

  // All hooks must be called before any conditional returns
  if (loading) {
    return <LoadingState message="Cargando preferencias..." />;
  }

  if (!state) {
    return (
      <ErrorState
        title="Error"
        message="No se pudieron cargar los datos"
        buttonText="← Volver al inicio"
        buttonLink="/"
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => setActiveId(active.id as string)}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over.id) {
          if (over.id === "unassigned") {
            // Manejar caso especial: desclasificar tarea
            setPreferences((prev) => {
              const newPrefs = { ...prev };
              delete newPrefs[active.id as string];
              return newPrefs;
            });

            // Enviar solicitud para eliminar preferencia
            fetcher.submit(
              {
                personName: selectedPerson,
                taskId: active.id as string,
                action: "remove_preference",
              },
              { method: "post" }
            );
          } else {
            // Caso normal: guardar preferencia
            setPreferences((prev) => ({
              ...prev,
              [active.id as string]: over.id as string,
            }));

            // Save to database using the route's action
            fetcher.submit(
              {
                personName: selectedPerson,
                taskId: active.id as string,
                preference: over.id as string,
              },
              { method: "post" }
            );
          }
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
              tasks={state.tasks}
              preferences={allPreferences}
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
          <div className="transform rotate-3 scale-105 shadow-2xl bg-white rounded-lg border-2 border-blue-500">
            <DraggableTask
              task={state.tasks.find((t) => t.id === activeId)!}
              isInOverlay={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
