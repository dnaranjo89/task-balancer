import { useDroppable } from "@dnd-kit/core";
import { DraggableTaskInBucket } from "./DraggableTaskInBucket";
import type { DroppableBucketProps } from "./types";

export function DroppableBucket({
  bucket,
  tasks,
  draggedTask,
}: DroppableBucketProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: bucket.value,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${bucket.color} text-white rounded-xl p-4 transition-all duration-300 min-h-[140px] md:min-h-[250px] ${
        draggedTask
          ? "ring-4 ring-yellow-300 ring-opacity-70 shadow-2xl"
          : "shadow-lg hover:shadow-xl"
      } ${
        isOver
          ? "ring-8 ring-white shadow-2xl !bg-white !bg-opacity-40 backdrop-blur-sm"
          : ""
      }`}
      style={{
        touchAction: "none",
        ...(isOver && {
          boxShadow:
            "0 0 0 4px rgba(255, 255, 255, 0.6), 0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        }),
      }}
    >
      {/* Mobile layout (default) */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="text-4xl mr-3">{bucket.emoji}</div>
            <div>
              <div className="font-bold text-xl">{bucket.label}</div>
              <div className="text-sm opacity-90">{bucket.description}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">
              {bucket.modifier > 0 ? "+" : ""}
              {bucket.modifier} pts
            </div>
            <div className="text-xs opacity-75">{tasks.length} tareas</div>
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block text-center mb-4">
        <div className="text-2xl mb-2">{bucket.emoji}</div>
        <div className="font-bold text-lg">{bucket.label}</div>
        <div className="text-sm opacity-90">{bucket.description}</div>
        <div className="text-xs mt-1">
          {bucket.modifier > 0 ? "+" : ""}
          {bucket.modifier} pts
        </div>
      </div>

      {(draggedTask || isOver) && (
        <div className="mb-3 p-3 bg-white bg-opacity-30 rounded-lg border-2 border-white border-opacity-50 border-dashed">
          <p className="text-sm font-bold text-center">
            🎯 Suelta aquí para asignar
          </p>
        </div>
      )}

      {tasks.length > 0 && (
        <div className="space-y-2">
          {tasks.map((task) => (
            <DraggableTaskInBucket
              key={task.id}
              task={task}
              isDragging={draggedTask === task.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
