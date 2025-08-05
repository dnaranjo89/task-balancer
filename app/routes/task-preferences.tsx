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

const PREFERENCE_OPTIONS = [
  {
    value: "me_gusta",
    label: "Me gusta 😍",
    modifier: -10,
    color: "bg-green-500",
  },
  {
    value: "no_me_cuesta",
    label: "No me cuesta 😊",
    modifier: -5,
    color: "bg-green-300",
  },
  {
    value: "indiferente",
    label: "Indiferente 😐",
    modifier: 0,
    color: "bg-gray-300",
  },
  {
    value: "me_cuesta",
    label: "Me cuesta 😤",
    modifier: 5,
    color: "bg-orange-300",
  },
  { value: "odio", label: "Lo odio 😡", modifier: 10, color: "bg-red-500" },
];

export default function TaskPreferences() {
  const { state, loading } = useTaskData();
  const fetcher = useFetcher();
  const [selectedPerson, setSelectedPerson] = useState<string>(PEOPLE[0]);
  const [preferences, setPreferences] = useState<Record<string, string>>({});

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

  const handlePreferenceChange = (taskId: string, preference: string) => {
    setPreferences({
      ...preferences,
      [taskId]: preference,
    });
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

  // Group tasks by category
  const tasksByCategory = state.tasks.reduce(
    (acc, task) => {
      const category = task.category || "Otros";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    },
    {} as Record<string, typeof state.tasks>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Preferencias de Tareas
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

        {/* Legend */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Escala de Preferencias
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {PREFERENCE_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`${option.color} text-white p-3 rounded-lg text-center`}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-sm">
                  {option.modifier > 0 ? "+" : ""}
                  {option.modifier} pts
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            💡 <strong>Tip:</strong> "Me gusta" reduce los puntos (menos
            esfuerzo), "Lo odio" los aumenta (más esfuerzo)
          </p>
        </div>

        {/* Tasks by Category */}
        <div className="space-y-6">
          {Object.entries(tasksByCategory).map(([category, tasks]) => (
            <div key={category} className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4 capitalize">
                {category}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {tasks.map((task) => {
                  const currentPref =
                    currentPreferences[task.id] ||
                    preferences[task.id] ||
                    "indiferente";
                  const selectedOption = PREFERENCE_OPTIONS.find(
                    (opt) => opt.value === currentPref
                  );

                  return (
                    <div
                      key={task.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {task.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {task.description}
                          </p>
                        </div>
                        <div className="text-right text-sm">
                          <div className="font-bold text-blue-600">
                            {task.basePoints} pts base
                          </div>
                          <div className="text-gray-500">
                            {task.finalPoints} pts final
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {PREFERENCE_OPTIONS.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`task-${task.id}`}
                              value={option.value}
                              checked={currentPref === option.value}
                              onChange={() =>
                                handlePreferenceChange(task.id, option.value)
                              }
                              className="mr-3"
                            />
                            <span
                              className={`flex-1 px-3 py-2 rounded text-sm ${
                                currentPref === option.value
                                  ? `${option.color} text-white`
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {option.label}
                              <span className="float-right">
                                {option.modifier > 0 ? "+" : ""}
                                {option.modifier}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
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
