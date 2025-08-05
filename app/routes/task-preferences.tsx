import type { Route } from "./+types/task-preferences";
import type {
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import { Link, Form, useFetcher } from "react-router";
import { Button } from "../components/Button";
import { useTaskData } from "../hooks/useTaskData";
import { useState } from "react";
import { PEOPLE } from "../data/tasks";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Preferencias de Tareas - Task Balancer" },
    {
      name: "description",
      content: "Configura tus preferencias personales para cada tarea",
    },
  ];
}

const DIFFICULTY_BUCKETS = [
  {
    value: "odio",
    label: "Lo detesto",
    emoji: "🤮",
    modifier: 10,
    color: "bg-red-500",
    description: "Me cuesta mucho trabajo",
  },
  {
    value: "me_cuesta",
    label: "Me cuesta",
    emoji: "�",
    modifier: 5,
    color: "bg-orange-400",
    description: "Requiere esfuerzo",
  },
  {
    value: "indiferente",
    label: "Normal",
    emoji: "😐",
    modifier: 0,
    color: "bg-gray-400",
    description: "Ni fácil ni difícil",
  },
  {
    value: "no_me_cuesta",
    label: "Fácil",
    emoji: "�",
    modifier: -5,
    color: "bg-green-400",
    description: "Me resulta sencillo",
  },
  {
    value: "me_gusta",
    label: "Me encanta",
    emoji: "🤩",
    modifier: -10,
    color: "bg-green-600",
    description: "Disfruto haciéndolo",
  },
];

// Draggable Task Component
function DraggableTask({
  task,
  isDragging = false,
  isMobile = false,
}: {
  task: any;
  isDragging?: boolean;
  isMobile?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, setActivatorNodeRef } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  // Create a transparent drag image to hide the browser's default drag preview
  const handleDragStart = (e: React.DragEvent) => {
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // Transparent 1x1 pixel
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  if (isMobile) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onDragStart={handleDragStart}
        className={`p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-move transition-all touch-manipulation select-none ${
          isDragging
            ? "opacity-30"
            : "hover:border-blue-400 hover:bg-blue-50 active:scale-95"
        }`}
      >
        <div className="text-center mb-2">
          <div className="text-2xl">📋</div>
        </div>
        <div className="font-semibold text-gray-800 text-sm text-center mb-2">
          {task.name}
        </div>
        <div className="text-xs text-gray-600 text-center mb-2 overflow-hidden">
          <div className="line-clamp-2">{task.description}</div>
        </div>
        <div className="text-xs text-blue-600 text-center bg-blue-50 rounded px-2 py-1">
          {task.basePoints} pts base
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          🤏 Mantén presionado y arrastra
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDragStart={handleDragStart}
      className={`p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-move transition-all hover:border-blue-400 hover:bg-blue-50 ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <div className="font-semibold text-gray-800 text-sm">{task.name}</div>
      <div className="text-xs text-gray-600 mt-1">{task.description}</div>
      <div className="text-xs text-blue-600 mt-1">
        {task.basePoints} pts base
      </div>
    </div>
  );
}

// Droppable Bucket Component
function DroppableBucket({
  bucket,
  tasks,
  isOver = false,
  draggedTask,
  isMobile = false,
}: {
  bucket: any;
  tasks: any[];
  isOver?: boolean;
  draggedTask: string | null;
  isMobile?: boolean;
}) {
  const { setNodeRef } = useDroppable({
    id: bucket.value,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${bucket.color} text-white rounded-xl p-4 transition-all ${
        isMobile ? "min-h-[140px]" : "min-h-[250px]"
      } ${
        draggedTask
          ? "ring-4 ring-yellow-300 ring-opacity-70 scale-105 shadow-2xl"
          : "shadow-lg hover:shadow-xl"
      } ${isOver ? "ring-4 ring-white ring-opacity-50" : ""}`}
    >
      {isMobile ? (
        // Mobile layout
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="text-4xl mr-3">{bucket.emoji}</div>
              <div>
                <div className="font-bold text-xl">{bucket.label}</div>
                <div className="text-sm opacity-90">{bucket.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">
                {bucket.modifier > 0 ? "+" : ""}
                {bucket.modifier} pts
              </div>
              <div className="text-xs opacity-75">{tasks.length} tareas</div>
            </div>
          </div>
        </>
      ) : (
        // Desktop layout
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">{bucket.emoji}</div>
          <div className="font-bold text-lg">{bucket.label}</div>
          <div className="text-sm opacity-90">{bucket.description}</div>
          <div className="text-xs mt-1">
            {bucket.modifier > 0 ? "+" : ""}
            {bucket.modifier} pts
          </div>
        </div>
      )}

      {(draggedTask || isOver) && (
        <div className="mb-3 p-3 bg-white bg-opacity-30 rounded-lg border-2 border-white border-opacity-50 border-dashed">
          <p className="text-sm font-bold text-center">
            🎯 Suelta aquí para asignar
          </p>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white bg-opacity-95 text-gray-800 rounded text-sm flex justify-between items-center shadow-sm ${
                isMobile ? "p-3" : "p-2"
              }`}
            >
              <div className="font-semibold">{task.name}</div>
              <div
                className={`text-xs opacity-75 bg-gray-100 px-2 py-1 rounded ${
                  isMobile ? "" : ""
                }`}
              >
                {task.basePoints} → {task.finalPoints} pts
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TaskPreferences() {
  const { state, loading } = useTaskData();
  const fetcher = useFetcher();
  const [selectedPerson, setSelectedPerson] = useState<string>(PEOPLE[0]);
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure sensors for better mobile support
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

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

  // Get current preferences for selected person
  const currentPreferences = state.tasks.reduce(
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
  );

  // Combine current and temporary preferences
  const allPreferences = { ...currentPreferences, ...preferences };

  // Separate tasks into assigned and unassigned
  const unassignedTasks = state.tasks.filter(
    (task) => !allPreferences[task.id]
  );

  // DND Kit handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setDraggedTask(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setPreferences({
        ...preferences,
        [active.id as string]: over.id as string,
      });
    }

    setActiveId(null);
    setDraggedTask(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setDraggedTask(null);
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("action", "set_multiple_preferences");
    formData.append("personName", selectedPerson);
    formData.append("preferences", JSON.stringify(preferences));

    fetcher.submit(formData, {
      method: "post",
      action: "/api/task-preferences",
    });

    setPreferences({});
  };

  const getTasksByBucket = (bucketValue: string) => {
    return state.tasks.filter(
      (task) => allPreferences[task.id] === bucketValue
    );
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <div className="max-w-7xl mx-auto">
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
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              ¿Quién configura sus preferencias?
            </h2>
            <div className="flex gap-4">
              {PEOPLE.map((person) => (
                <button
                  key={person}
                  onClick={() => setSelectedPerson(person)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    selectedPerson === person
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {person}
                </button>
              ))}
            </div>
          </div>

          {/* Instructions - Mobile optimized */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">
              📝 Instrucciones
            </h3>
            <div className="text-blue-700 space-y-2">
              <p className="md:hidden">
                <strong>En móvil:</strong> Mantén presionada una tarea y
                arrástrala hacia el nivel de dificultad correspondiente. Los
                buckets se iluminarán cuando puedas soltar la tarea.
              </p>
              <p className="hidden md:block">
                Arrastra las tareas desde la lista de arriba hacia el bucket que
                mejor describa qué tan difícil te resulta cada una. Las tareas
                más difíciles obtendrán más puntos, las más fáciles menos
                puntos.
              </p>
            </div>
          </div>

          {/* Mobile-first Layout */}
          <div className="space-y-6">
            {/* Unassigned Tasks - Now at the top for mobile */}
            {unassignedTasks.length > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Tareas por Clasificar ({unassignedTasks.length})
                </h3>

                {/* Mobile: Horizontal scroll for tasks */}
                <div className="md:hidden">
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {unassignedTasks.map((task) => (
                      <div key={task.id} className="flex-shrink-0 w-52">
                        <DraggableTask
                          task={task}
                          isDragging={activeId === task.id}
                          isMobile={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop: Grid layout */}
                <div className="hidden md:block">
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {unassignedTasks.map((task) => (
                      <DraggableTask
                        key={task.id}
                        task={task}
                        isDragging={activeId === task.id}
                        isMobile={false}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Difficulty Buckets */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Niveles de Dificultad
              </h3>

              {/* Mobile: Single column, larger touch targets */}
              <div className="md:hidden space-y-4">
                {DIFFICULTY_BUCKETS.map((bucket) => (
                  <DroppableBucket
                    key={bucket.value}
                    bucket={bucket}
                    tasks={getTasksByBucket(bucket.value)}
                    draggedTask={draggedTask}
                    isMobile={true}
                  />
                ))}
              </div>

              {/* Desktop: Grid layout */}
              <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
                {DIFFICULTY_BUCKETS.map((bucket) => (
                  <DroppableBucket
                    key={bucket.value}
                    bucket={bucket}
                    tasks={getTasksByBucket(bucket.value)}
                    draggedTask={draggedTask}
                    isMobile={false}
                  />
                ))}
              </div>
            </div>

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

      <DragOverlay dropAnimation={null}>
        {activeId ? (
          <div className="transform rotate-3 scale-105 shadow-2xl">
            <DraggableTask
              task={state.tasks.find((t) => t.id === activeId)}
              isDragging={false}
              isMobile={false}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
