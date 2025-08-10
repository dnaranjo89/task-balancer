import { useState, useEffect } from "react";
import { useFetcher } from "react-router";
import type { CompletedTask } from "../types/tasks";

interface DeleteCompletedTaskButtonProps {
  completedTask: CompletedTask;
  onSuccess?: () => void;
}

export function DeleteCompletedTaskButton({
  completedTask,
  onSuccess,
}: DeleteCompletedTaskButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const fetcher = useFetcher();

  // Watch for successful completion and call onSuccess
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      onSuccess?.();
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const handleDelete = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    fetcher.submit(
      {
        completedTaskId: completedTask.id.toString(),
      },
      { method: "post", action: "/api/delete-completed-task" }
    );

    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const isLoading = fetcher.state === "submitting";

  if (showConfirmation) {
    return (
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
          title="Confirmar eliminación"
        >
          {isLoading ? "..." : "✓"}
        </button>
        <button
          onClick={handleCancel}
          disabled={isLoading}
          className="px-3 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
          title="Cancelar"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDelete}
      className="px-3 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
      title="Eliminar tarea completada"
    >
      🗑️
    </button>
  );
}
