import type { SelectableTask } from "./types";

interface SelectableTaskCardProps {
  task: SelectableTask;
  onToggle: (taskId: string) => void;
}

export function SelectableTaskCard({
  task,
  onToggle,
}: SelectableTaskCardProps) {
  return (
    <div
      onClick={() => onToggle(task.id)}
      className={`cursor-pointer border-2 rounded-lg transition-all duration-200 ${
        task.selected
          ? "border-green-500 bg-green-50 shadow-lg scale-105"
          : "border-gray-200 bg-white hover:border-green-300 hover:shadow-md"
      }`}
    >
      <div className="p-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.selected}
                onChange={() => onToggle(task.id)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <div className="font-bold text-base text-gray-800">
                {task.name}
              </div>
            </div>
            <div className="text-xs text-gray-500 mt-1 ml-6">
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
          <div className="text-right ml-4">
            <div
              className={`text-xl font-bold ${
                task.selected ? "text-green-600" : "text-gray-600"
              }`}
            >
              +{task.finalPoints}
            </div>
            <div className="text-xs text-gray-500">
              {task.preferences.length > 0 ? "con preferencias" : "puntos base"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
