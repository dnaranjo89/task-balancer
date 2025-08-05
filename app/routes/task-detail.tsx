import type { Route } from "./+types/task-detail";
import { Link, Form } from "react-router";
import { Button, LoadingState, ErrorState } from "../components";
import { useTaskData } from "../hooks/useTaskData";
import { useState } from "react";

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: `Detalle de Tarea - Task Balancer` },
    {
      name: "description",
      content: `Detalles y valoraciones de la tarea`,
    },
  ];
}

export default function TaskDetail({ params }: Route.ComponentProps) {
  const { state, loading, fetcher } = useTaskData();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const taskId = params.taskId;

  if (loading) {
    return (
      <LoadingState
        message="Cargando tarea..."
        gradient="from-blue-50 to-indigo-100"
      />
    );
  }

  if (!state) {
    return (
      <ErrorState
        title="Error"
        message="No se pudieron cargar los datos"
        gradient="from-red-50 to-red-100"
      />
    );
  }

  const task = state.tasks.find((t) => t.id === taskId);

  if (!task) {
    return (
      <ErrorState
        title="Tarea no encontrada"
        message={`La tarea "${taskId}" no existe en el sistema.`}
        buttonText="← Volver a la lista"
        buttonLink="/tasks"
        gradient="from-red-50 to-red-100"
      />
    );
  }

  const handleRatingChange = (personName: string, points: number) => {
    setRatings({ ...ratings, [personName]: points });
  };

  const submitRating = async (personName: string) => {
    const points = ratings[personName];
    if (points && points >= 1 && points <= 50) {
      const formData = new FormData();
      formData.append("personName", personName);
      formData.append("points", points.toString());

      fetcher.submit(formData, {
        method: "post",
        action: `/api/tasks/${taskId}/rate`,
      });

      // Clear the rating for this person
      setRatings({ ...ratings, [personName]: 0 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{task.name}</h1>
          <Link to="/tasks">
            <Button onClick={() => {}} variant="secondary">
              ← Volver a la lista
            </Button>
          </Link>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {task.name}
              </h2>
              <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                {task.category}
              </span>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {task.averagePoints} pts
              </div>
              <div className="text-sm text-gray-500">
                {task.ratings.length > 0 ? "Media actual" : "Valor por defecto"}
              </div>
            </div>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed">
            {task.description}
          </p>
        </div>

        {/* Rating Section */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Valoraciones de cada persona
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.people.map((person) => {
              const existingRating = task.ratings.find(
                (r) => r.personName === person.name
              );
              const currentRating =
                ratings[person.name] || existingRating?.points || 0;

              return (
                <div
                  key={person.name}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-semibold text-lg text-gray-800 mb-3">
                    {person.name}
                  </h4>

                  {existingRating && (
                    <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-green-800">
                          Valoración actual:
                        </span>
                        <span className="font-bold text-green-600">
                          {existingRating.points} puntos
                        </span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">
                        {new Date(existingRating.createdAt).toLocaleDateString(
                          "es-ES"
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {existingRating
                          ? "Nueva valoración:"
                          : "Asignar puntos:"}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={currentRating}
                        onChange={(e) =>
                          handleRatingChange(
                            person.name,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>1</span>
                        <span className="font-semibold text-blue-600">
                          {currentRating || 1} puntos
                        </span>
                        <span>50</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => submitRating(person.name)}
                      variant="primary"
                      size="small"
                      disabled={
                        !ratings[person.name] || ratings[person.name] < 1
                      }
                      className="w-full"
                    >
                      {existingRating
                        ? "Actualizar valoración"
                        : "Guardar valoración"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Ratings Summary */}
        {task.ratings.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Resumen de valoraciones
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {task.averagePoints}
                </div>
                <div className="text-sm text-gray-600">Puntos promedio</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {task.ratings.length}/{state.people.length}
                </div>
                <div className="text-sm text-gray-600">
                  Personas han valorado
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
