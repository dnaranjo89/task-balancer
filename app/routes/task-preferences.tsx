import type { Route } from "./+types/task-preferences";
import { Link, Form, useFetcher } from "react-router";
import { Button } from "../components/Button";
import { useTaskData } from "../hooks/useTaskData";
import { useState } from "react";
import { PEOPLE } from "../data/tasks";

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

export default function TaskPreferences() {
  const { state, loading } = useTaskData();
  const fetcher = useFetcher();
  const [selectedPerson, setSelectedPerson] = useState<string>(PEOPLE[0]);
  const [preferences, setPreferences] = useState<Record<string, string>>({});
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

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
    (task) =>
      !allPreferences[task.id] || allPreferences[task.id] === "indiferente"
  );

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, bucketValue: string) => {
    e.preventDefault();
    if (draggedTask) {
      setPreferences({
        ...preferences,
        [draggedTask]: bucketValue,
      });
      setDraggedTask(null);
    }
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

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-blue-800 mb-2">
            📝 Instrucciones
          </h3>
          <p className="text-blue-700">
            Arrastra las tareas desde la lista de abajo hacia el bucket que
            mejor describa qué tan difícil te resulta cada una. Las tareas más
            difíciles obtendrán más puntos, las más fáciles menos puntos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          {/* Difficulty Buckets */}
          <div className="lg:col-span-5">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Niveles de Dificultad
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {DIFFICULTY_BUCKETS.map((bucket) => (
                <div
                  key={bucket.value}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, bucket.value)}
                  className={`${bucket.color} text-white rounded-xl p-4 min-h-[200px] transition-all ${
                    draggedTask ? "ring-4 ring-yellow-300 ring-opacity-50" : ""
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="text-2xl mb-2">{bucket.emoji}</div>
                    <div className="font-bold text-lg">{bucket.label}</div>
                    <div className="text-sm opacity-90">
                      {bucket.description}
                    </div>
                    <div className="text-xs mt-1">
                      {bucket.modifier > 0 ? "+" : ""}
                      {bucket.modifier} pts
                    </div>
                  </div>

                  <div className="space-y-2">
                    {getTasksByBucket(bucket.value).map((task) => (
                      <div
                        key={task.id}
                        className="bg-white bg-opacity-90 text-gray-800 p-2 rounded text-sm"
                      >
                        <div className="font-semibold">{task.name}</div>
                        <div className="text-xs opacity-75">
                          {task.basePoints} pts → {task.finalPoints} pts
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unassigned Tasks */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Tareas por Clasificar
            </h3>
            <div className="bg-white rounded-xl p-4 shadow-lg min-h-[400px]">
              <div className="space-y-3">
                {unassignedTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className={`p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-move transition-all hover:border-blue-400 hover:bg-blue-50 ${
                      draggedTask === task.id ? "opacity-50 scale-95" : ""
                    }`}
                  >
                    <div className="font-semibold text-gray-800 text-sm">
                      {task.name}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {task.description}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      {task.basePoints} pts base
                    </div>
                  </div>
                ))}

                {unassignedTasks.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-2">✅</div>
                    <div className="text-sm">
                      ¡Todas las tareas clasificadas!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
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
  );
}
