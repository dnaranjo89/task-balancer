import type { Route } from "./+types/task-selection";
import { Link } from "react-router";
import { Button, LoadingState, ErrorState, TaskButton } from "../components";
import { useTaskData } from "../hooks/useTaskData";
import { PEOPLE } from "../data/tasks";

export function meta({ params }: Route.MetaArgs) {
  const personName = decodeURIComponent(params.personId);
  const person = PEOPLE.find(
    (p) => p.toLowerCase() === personName.toLowerCase()
  );

  return [
    { title: `Tareas para ${person || personName} - Task Balancer` },
    {
      name: "description",
      content: `Selecciona una tarea para ${person || personName}`,
    },
  ];
}

export default function TaskSelection({ params }: Route.ComponentProps) {
  const { state, loading } = useTaskData();
  const personId = params.personId;
  const personName = PEOPLE.find(
    (p) => p.toLowerCase() === personId.toLowerCase()
  );

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state?.tasks.map((task) => (
            <TaskButton key={task.id} task={task} personName={personName} />
          ))}
        </div>
      </div>
    </div>
  );
}
