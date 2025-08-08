import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableTaskProps } from "./types";

export function DraggableTask({
  task,
  isDragging = false,
  isInOverlay = false,
}: DraggableTaskProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none", // Prevent scrolling when touching this element
  };

  // Create a transparent drag image to hide the browser's default drag preview
  const handleDragStart = (e: React.DragEvent) => {
    const dragImage = new Image();
    dragImage.src =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="; // Transparent 1x1 pixel
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onDragStart={handleDragStart}
      className={`
        p-4 md:p-3 ${isInOverlay ? "" : "border-2 border-dashed border-gray-300"} rounded-lg 
        cursor-grab active:cursor-grabbing transition-all bg-white
        ${!isInOverlay ? "hover:border-blue-400 hover:bg-blue-50 hover:shadow-md" : ""} 
        touch-manipulation select-none
        min-h-[100px] md:min-h-[auto]
        active:scale-105
        ${isDragging ? "opacity-0 scale-105 shadow-lg border-blue-500 z-10" : ""}
      `}
    >
      {/* Drag handle indicator */}
      {!isInOverlay && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1 text-gray-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
            </svg>
            <span className="text-xs font-medium">ARRASTRA</span>
          </div>
          <div className="text-xs text-blue-600 font-medium">
            {task.basePoints} pts
          </div>
        </div>
      )}

      <div className="font-semibold text-gray-800 text-sm">{task.name}</div>
      <div className="text-xs text-gray-600 mt-1">
        {task.description || "Sin descripción"}
      </div>

      {/* Mobile-specific drag hint */}
      {!isInOverlay && (
        <div className="md:hidden text-xs text-gray-400 mt-2 text-center bg-gray-50 rounded px-2 py-1">
          👆 Mantén presionado para arrastrar
        </div>
      )}
    </div>
  );
}
