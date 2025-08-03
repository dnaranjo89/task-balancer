import type { Person, CompletedTask } from "../types/tasks";

interface ScoreboardProps {
  people: Person[];
  completedTasks: CompletedTask[];
}

export function Scoreboard({ people, completedTasks }: ScoreboardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const recentTasks = completedTasks.slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Puntuaciones */}
      <div className="grid grid-cols-2 gap-4">
        {people.map((person) => (
          <div
            key={person.name}
            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {person.name}
            </h3>
            <div className="text-3xl font-bold text-blue-600">
              {person.totalPoints} pts
            </div>
          </div>
        ))}
      </div>

      {/* Historial de tareas */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Últimas tareas realizadas
        </h3>
        {recentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No hay tareas registradas aún
          </p>
        ) : (
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold text-gray-800">
                    {task.taskName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {task.personName} • {formatDate(task.completedAt)}
                  </div>
                </div>
                <div className="text-green-600 font-bold">+{task.points}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
