import type { TaskWithRatings } from "../../types/tasks";
import { TaskInfo } from "./TaskInfo";

interface SingleTaskButtonProps {
  task: TaskWithRatings;
  onSubmit: (task: TaskWithRatings) => void;
  isLoading: boolean;
}

export function SingleTaskButton({
  task,
  onSubmit,
  isLoading,
}: SingleTaskButtonProps) {
  return (
    <button
      onClick={() => onSubmit(task)}
      disabled={isLoading}
      className="w-full text-left flex justify-between items-center min-h-16 bg-green-500 hover:bg-green-600 text-white shadow-lg px-6 py-3 text-base font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50"
    >
      <div className="flex-1">
        <div className="font-bold text-base">{task.name}</div>
        <TaskInfo task={task} />
      </div>
      <div className="text-right ml-4">
        <div className="text-xl font-bold">+{task.finalPoints}</div>
        <div className="text-xs opacity-70">
          {task.preferences.length > 0 ? "con preferencias" : "puntos base"}
        </div>
      </div>
    </button>
  );
}
