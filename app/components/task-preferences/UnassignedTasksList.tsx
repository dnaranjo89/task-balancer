import { DraggableTask } from "./DraggableTask";
import type { TaskWithRatings } from "../../types/tasks";

interface UnassignedTasksListProps {
  tasks: TaskWithRatings[];
  activeId: string | null;
}

export function UnassignedTasksList({
  tasks,
  activeId,
}: UnassignedTasksListProps) {
  // Don't render anything if no tasks, but maintain consistent component structure
  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Tareas por Clasificar ({tasks.length})
      </h3>

      {/* Mobile: Horizontal scroll layout */}
      <div className="md:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {tasks.map((task) => (
            <div key={task.id} className="flex-shrink-0 w-52">
              <DraggableTask task={task} isDragging={activeId === task.id} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {tasks.map((task) => (
          <DraggableTask
            key={task.id}
            task={task}
            isDragging={activeId === task.id}
          />
        ))}
      </div>
    </div>
  );
}
