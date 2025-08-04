import type { Route } from "./+types/task-preferences";
import { useState } from "react";
import { useFetcher } from "react-router";
import { useTaskData } from "../hooks/useTaskData";
import { AppLayout, DataLayout, Button } from "../components";
import { TaskPreferenceGrid } from "../components/tasks/TaskPreferenceGrid";
import type { AppState, Task } from "../types/tasks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Preferencias de Tareas - Task Balancer" },
    {
      name: "description",
      content: "Configura tus preferencias para cada tipo de tarea",
    },
  ];
}

export default function TaskPreferences() {
  const { state, loading } = useTaskData();

  return (
    <DataLayout
      data={state}
      loading={loading}
      loadingMessage="Cargando preferencias..."
    >
      {(data) => <TaskPreferencesContent state={data} />}
    </DataLayout>
  );
}

function TaskPreferencesContent({ state }: { state: AppState }) {
  const [selectedPerson, setSelectedPerson] = useState<string>("");

  if (!selectedPerson) {
    return (
      <AppLayout title="Preferencias de Tareas" showBackButton backTo="/">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selecciona tu perfil
            </h2>
            <p className="text-gray-600 mb-6">
              Configura tus preferencias para cada tipo de tarea. Esto nos
              ayudará a sugerir tareas más acordes a tus gustos.
            </p>

            <div className="space-y-3">
              {state.people.map((person) => (
                <button
                  key={person.name}
                  onClick={() => setSelectedPerson(person.name)}
                  className="w-full p-4 text-left bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200 hover:border-purple-400 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-800">
                      {person.name}
                    </span>
                    <span className="text-purple-600">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={`Preferencias de ${selectedPerson}`}
      showBackButton
      backTo="/"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => setSelectedPerson("")} variant="secondary">
            ← Cambiar persona
          </Button>
        </div>

        <TaskPreferenceGrid tasks={state.tasks} personName={selectedPerson} />
      </div>
    </AppLayout>
  );
}
