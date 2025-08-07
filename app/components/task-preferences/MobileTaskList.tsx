import type { TaskWithRatings } from "../../types/tasks";
import { DIFFICULTY_BUCKETS } from "./constants";

interface MobileTaskListProps {
  tasks: TaskWithRatings[];
  selectedTask: string | null;
  onTaskClick: (taskId: string) => void;
  preferences: Record<string, string>;
}

export function MobileTaskList({
  tasks,
  selectedTask,
  onTaskClick,
  preferences,
}: MobileTaskListProps) {
  // Group tasks by their current preference/bucket
  const groupedTasks = DIFFICULTY_BUCKETS.reduce(
    (acc, bucket) => {
      acc[bucket.value] = tasks.filter(
        (task) => preferences[task.id] === bucket.value
      );
      return acc;
    },
    {} as Record<string, TaskWithRatings[]>
  );

  // Unassigned tasks
  const unassignedTasks = tasks.filter((task) => !preferences[task.id]);

  return (
    <div className="space-y-6">
      {/* Unassigned Tasks */}
      {unassignedTasks.length > 0 && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <span className="text-2xl mr-2">📝</span>
            Tareas sin clasificar ({unassignedTasks.length})
          </h3>
          <div className="space-y-2">
            {unassignedTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                isSelected={selectedTask === task.id}
                onTaskClick={onTaskClick}
                bucketColor="border-gray-300 bg-white"
              />
            ))}
          </div>
        </div>
      )}

      {/* Difficulty Buckets */}
      {DIFFICULTY_BUCKETS.map((bucket) => {
        const bucketTasks = groupedTasks[bucket.value];
        if (bucketTasks.length === 0) return null;

        return (
          <div
            key={bucket.value}
            className={`border-2 rounded-xl p-4 ${bucket.color}`}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">{bucket.emoji}</span>
              {bucket.label} ({bucketTasks.length})
            </h3>
            <p className="text-sm text-gray-600 mb-3">{bucket.description}</p>
            <div className="space-y-2">
              {bucketTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isSelected={selectedTask === task.id}
                  onTaskClick={onTaskClick}
                  bucketColor="bg-white/70 border-gray-200"
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Help text */}
      {unassignedTasks.length === 0 &&
        Object.values(groupedTasks).every((bucket) => bucket.length === 0) && (
          <div className="text-center text-gray-500 py-8 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <div className="text-4xl mb-2">✅</div>
            <div className="text-lg font-semibold">¡Perfecto!</div>
            <div className="text-sm mt-1">
              Todas las tareas están clasificadas
            </div>
          </div>
        )}
    </div>
  );
}

interface TaskCardProps {
  task: TaskWithRatings;
  isSelected: boolean;
  onTaskClick: (taskId: string) => void;
  bucketColor: string;
}

function TaskCard({
  task,
  isSelected,
  onTaskClick,
  bucketColor,
}: TaskCardProps) {
  return (
    <button
      onClick={() => onTaskClick(task.id)}
      className={`w-full p-3 rounded-lg border transition-all text-left ${bucketColor} ${
        isSelected
          ? "ring-2 ring-blue-500 shadow-lg scale-105"
          : "hover:shadow-md hover:scale-102"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{task.name}</h4>
          {task.description && (
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <span className="text-xs text-gray-500">{task.points} pts</span>
        </div>
        {isSelected && (
          <div className="ml-2 text-blue-500">
            <span className="text-sm">👆 Toca para cambiar</span>
          </div>
        )}
      </div>
    </button>
  );
}
