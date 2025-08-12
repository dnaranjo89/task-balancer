import type { Route } from "./+types/scoreboard";
import { Link } from "react-router";
import { Button, Scoreboard, LoadingState, ErrorState } from "../components";
import { useTaskData } from "../hooks/useTaskData";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Puntuaciones - Task Balancer" },
    {
      name: "description",
      content: "Puntuaciones y historial de tareas completadas",
    },
  ];
}

export default function ScoreboardPage() {
  const { state, loading, refetch } = useTaskData();

  if (loading) {
    return (
      <LoadingState
        message="Cargando puntuaciones..."
        gradient="from-blue-50 to-indigo-100"
      />
    );
  }

  if (!state) {
    return (
      <ErrorState title="Error" message="No se pudieron cargar los datos" />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Puntuaciones</h1>
          </div>
          
          {/* Back button */}
          <div className="flex justify-center sm:justify-end">
            <Link to="/">
              <Button onClick={() => {}} variant="secondary" className="w-full sm:w-auto">
                ← Volver
              </Button>
            </Link>
          </div>
        </div>
        <Scoreboard
          people={state.people}
          completedTasks={state.completedTasks}
          onExtraPointsUpdate={refetch}
        />
      </div>
    </div>
  );
}
