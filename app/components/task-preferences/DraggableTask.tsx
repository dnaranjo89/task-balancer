import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableTaskProps } from "./types";

export function DraggableTask({
  task,
  isDragging = false,
  isMobile = false,
}: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  // Create a transparent drag image to hide the browser's default drag preview
  const handleDragStart = (e: React.DragEvent) => {
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // Transparent 1x1 pixel
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  if (isMobile) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        onDragStart={handleDragStart}
        className={`p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-move transition-all touch-manipulation select-none ${
          isDragging
            ? "opacity-30"
            : "hover:border-blue-400 hover:bg-blue-50 active:scale-95"
        }`}
      >
        <div className="text-center mb-2">
          <div className="text-2xl">📋</div>
        </div>
        <div className="font-semibold text-gray-800 text-sm text-center mb-2">
          {task.name}
        </div>
        <div className="text-xs text-gray-600 text-center mb-2 overflow-hidden">
          <div className="line-clamp-2">
            {task.description || "Sin descripción"}
          </div>
        </div>
        <div className="text-xs text-blue-600 text-center bg-blue-50 rounded px-2 py-1">
          {task.basePoints} pts base
        </div>
        <div className="text-xs text-gray-500 text-center mt-2">
          🤏 Mantén presionado y arrastra
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDragStart={handleDragStart}
      className={`p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-move transition-all hover:border-blue-400 hover:bg-blue-50 ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <div className="font-semibold text-gray-800 text-sm">{task.name}</div>
      <div className="text-xs text-gray-600 mt-1">
        {task.description || "Sin descripción"}
      </div>
      <div className="text-xs text-blue-600 mt-1">
        {task.basePoints} pts base
      </div>
    </div>
  );
}
