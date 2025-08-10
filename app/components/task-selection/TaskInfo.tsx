import type { TaskWithRatings } from "../../types/tasks";

interface TaskInfoProps {
  task: TaskWithRatings;
}

export function TaskInfo({ task }: TaskInfoProps) {
  return (
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
  );
}
