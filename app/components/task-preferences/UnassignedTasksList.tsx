import { useDroppable } from "@dnd-kit/core";
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
  const { isOver, setNodeRef } = useDroppable({
    id: "unassigned", // ID especial para desclasificar tareas
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-xl p-4 shadow-lg transition-all duration-300 ${
        isOver
          ? "ring-8 ring-blue-400 shadow-2xl !bg-blue-100 backdrop-blur-sm"
          : ""
      }`}
      style={{
        ...(isOver && {
          boxShadow:
            "0 0 0 4px rgba(59, 130, 246, 0.6), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }),
      }}
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">📋</span>
        Tareas por Clasificar ({tasks.length})
      </h3>

      {isOver && (
        <div className="mb-4 p-3 bg-blue-100 border-2 border-blue-500 border-dashed rounded-lg">
          <p className="text-sm font-bold text-blue-700 text-center">
            🎯 Suelta aquí para desclasificar esta tarea
          </p>
        </div>
      )}

      {tasks.length === 0 && !isOver && (
        <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-2xl mb-2">✅</div>
          <p className="text-sm">Todas las tareas están clasificadas</p>
          <p className="text-xs text-gray-400 mt-1">
            Arrastra una tarea aquí para desclasificarla
          </p>
        </div>
      )}

      {tasks.length > 0 && (
        <>
          {/* Mobile: Vertical grid layout (no horizontal scroll) */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 gap-3">
              {tasks.map((task) => (
                <DraggableTask
                  key={task.id}
                  task={task}
                  isDragging={activeId === task.id}
                />
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
        </>
      )}
    </div>
  );
}
