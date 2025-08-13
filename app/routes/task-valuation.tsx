import { Link } from "react-router";
import {
  Button,
  LoadingState,
  ErrorState,
  PersonRatingCard,
} from "../components";
import { useTaskData } from "../hooks/useTaskData";
import type { TaskWithRatings } from "../types/tasks";

export function meta({ params }: { params: { taskId: string } }) {
  return [
    { title: `Valoración de Tarea - Task Balancer` },
    {
      name: "description",
      content: `Valorar y gestionar puntuaciones de la tarea`,
    },
  ];
}

interface TaskValuationProps {
  params: { taskId: string };
}

export default function TaskValuation({ params }: TaskValuationProps) {
  const { state, loading, fetcher } = useTaskData();
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

  const handleSubmitRating = async (personName: string, points: number) => {
    const formData = new FormData();
    formData.append("personName", personName);
    formData.append("points", points.toString());

    fetcher.submit(formData, {
      method: "post",
      action: `/api/tasks/${taskId}/rate`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          {/* Title */}
          <div className="mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {task.name}
            </h1>
          </div>

          {/* Back button */}
          <div className="flex justify-center sm:justify-end">
            <Link to="/tasks">
              <Button
                onClick={() => {}}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                ← Volver a la lista
              </Button>
            </Link>
          </div>
        </div>

        {/* Task Details */}
        <TaskDetailsCard task={task} />

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

              return (
                <PersonRatingCard
                  key={person.name}
                  person={person}
                  existingRating={existingRating}
                  onSubmitRating={handleSubmitRating}
                />
              );
            })}
          </div>
        </div>

        {/* Current Ratings Summary */}
        {task.ratings.length > 0 && (
          <RatingsSummary task={task} peopleCount={state.people.length} />
        )}
      </div>
    </div>
  );
}

function TaskDetailsCard({ task }: { task: TaskWithRatings }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{task.name}</h2>
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
  );
}

function RatingsSummary({
  task,
  peopleCount,
}: {
  task: TaskWithRatings;
  peopleCount: number;
}) {
  return (
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
            {task.ratings.length}/{peopleCount}
          </div>
          <div className="text-sm text-gray-600">Personas han valorado</div>
        </div>
      </div>
    </div>
  );
}
