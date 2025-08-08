import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableTaskProps } from "./types";

export function DraggableTaskInBucket({
  task,
  isDragging = false,
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
        bg-white bg-opacity-95 text-gray-800 rounded text-sm 
        flex justify-between items-center shadow-sm 
        p-3 md:p-2 cursor-grab active:cursor-grabbing transition-all 
        hover:bg-opacity-100 hover:shadow-md hover:scale-102
        touch-manipulation select-none border border-gray-200
        ${isDragging ? "opacity-0 scale-105 shadow-lg border border-blue-500 z-10" : ""}
      `}
    >
      <div className="flex items-center space-x-2">
        <svg
          className="w-3 h-3 text-gray-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M7 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM13 14a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
        <div className="font-semibold">{task.name}</div>
      </div>
      <div className="text-xs opacity-75 bg-gray-100 px-2 py-1 rounded">
        {task.basePoints} → {task.finalPoints} pts
      </div>
    </div>
  );
}
