import type { Route } from "./+types/scoreboard";
import { Link } from "react-router";
import { Button } from "../components/Button";
import { Scoreboard } from "../components/Scoreboard";
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
  const { state, loading } = useTaskData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Cargando puntuaciones...
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Puntuaciones</h1>
          <Link to="/">
            <Button onClick={() => {}} variant="secondary">
              ← Volver
            </Button>
          </Link>
        </div>
        <Scoreboard
          people={state.people}
          completedTasks={state.completedTasks}
        />
      </div>
    </div>
  );
}
