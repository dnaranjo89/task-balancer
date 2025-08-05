import { useTaskData } from "../hooks/useTaskData";
import type { TaskWithRatings } from "../types/tasks";

interface TaskButtonProps {
  task: TaskWithRatings;
  personName: string;
}

export function TaskButton({ task, personName }: TaskButtonProps) {
  const { fetcher } = useTaskData();

  return (
    <fetcher.Form method="post" action="/api/tasks" className="w-full">
      <input type="hidden" name="action" value="complete" />
      <input type="hidden" name="personName" value={personName} />
      <input type="hidden" name="taskId" value={task.id} />
      <input type="hidden" name="taskName" value={task.name} />
      <input type="hidden" name="points" value={task.finalPoints} />

      <button
        type="submit"
        className="w-full text-left flex justify-between items-center min-h-16 bg-green-500 hover:bg-green-600 text-white shadow-lg px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 active:scale-95"
      >
        <div>
          <div className="font-bold text-lg">{task.name}</div>
          {task.category && (
            <div className="text-sm opacity-80 capitalize">{task.category}</div>
          )}
          <div className="text-xs opacity-70 mt-1">
            Base: {task.basePoints} pts
            {task.preferences.length > 0 && (
              <span> | Con preferencias: {task.finalPoints} pts</span>
            )}
            {task.ratings.length > 0 && (
              <span>
                {" "}
                | {task.ratings.length} valoración
                {task.ratings.length !== 1 ? "es" : ""}
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">+{task.finalPoints}</div>
          <div className="text-xs opacity-70">
            {task.preferences.length > 0 ? "con preferencias" : "puntos base"}
          </div>
        </div>
      </button>
    </fetcher.Form>
  );
}
