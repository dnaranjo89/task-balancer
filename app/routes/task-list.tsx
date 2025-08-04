import type { Route } from "./+types/task-list";
import { Link } from "react-router";
import { Button, LoadingState, ErrorState } from "../components";
import { useTaskData } from "../hooks/useTaskData";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lista de Tareas - Task Balancer" },
    {
      name: "description",
      content: "Todas las tareas disponibles para gestionar y calificar",
    },
  ];
}

export default function TaskList() {
  const { state, loading } = useTaskData();

  if (loading) {
    return <LoadingState message="Cargando tareas..." />;
  }

  if (!state) {
    return (
      <ErrorState title="Error" message="No se pudieron cargar los datos" />
    );
  }

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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Lista de Tareas</h1>
          <Link to="/">
            <Button onClick={() => {}} variant="secondary">
              ← Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="space-y-8">
          {Object.entries(tasksByCategory).map(([category, tasks]) => (
            <div key={category} className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task) => (
                  <Link
                    key={task.id}
                    to={`/tasks/${task.id}`}
                    className="block"
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {task.name}
                        </h3>
                        <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {task.points} pts
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {task.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {task.ratings.length > 0
                            ? `${task.ratings.length} valoración${task.ratings.length !== 1 ? "es" : ""}`
                            : "Sin valoraciones"}
                        </span>
                        <span>
                          {task.ratings.length > 0
                            ? `Media: ${task.averagePoints} pts`
                            : `Por defecto: ${task.points} pts`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
