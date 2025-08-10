import type { Route } from "./+types/task-selection";
import { Link } from "react-router";
import {
  Button,
  LoadingState,
  ErrorState,
  MultipleTaskSelector,
} from "../components";
import { useTaskData } from "../hooks/useTaskData";

export function meta({ params }: Route.MetaArgs) {
  const personName = decodeURIComponent(params.personId);

  return [
    { title: `Tareas para ${personName} - Task Balancer` },
    {
      name: "description",
      content: `Selecciona una o múltiples tareas para ${personName}`,
    },
  ];
}

export default function TaskSelection({ params }: Route.ComponentProps) {
  const { state, loading } = useTaskData();
  const personId = params.personId;
  const personName =
    state?.people.find((p) => p.name.toLowerCase() === personId.toLowerCase())
      ?.name || decodeURIComponent(personId);

  if (loading) {
    return (
      <LoadingState
        message="Cargando tareas..."
        gradient="from-green-50 to-emerald-100"
      />
    );
  }

  if (!personName) {
    return (
      <ErrorState
        title="Persona no encontrada"
        message={`La persona "${personId}" no existe en el sistema.`}
        buttonText="← Volver al inicio"
        buttonLink="/"
        gradient="from-red-50 to-red-100"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Tareas para {personName}
          </h1>
          <Link to="/">
            <Button onClick={() => {}} variant="secondary">
              ← Volver
            </Button>
          </Link>
        </div>

        <MultipleTaskSelector
          tasks={state?.tasks || []}
          personName={personName}
        />
      </div>
    </div>
  );
}
