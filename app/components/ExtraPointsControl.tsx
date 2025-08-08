import { useState } from "react";
import { useFetcher } from "react-router";
import type { CompletedTask } from "../types/tasks";

interface ExtraPointsControlProps {
  completedTask: CompletedTask;
  onSuccess?: () => void;
}

export function ExtraPointsControl({
  completedTask,
  onSuccess,
}: ExtraPointsControlProps) {
  const [selectedPoints, setSelectedPoints] = useState<number>(
    completedTask.extraPoints
  );
  const fetcher = useFetcher();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (points: number) => {
    if (points === completedTask.extraPoints) {
      setIsOpen(false);
      return;
    }

    fetcher.submit(
      {
        completedTaskId: completedTask.id,
        extraPoints: points.toString(),
      },
      { method: "post", action: "/api/extra-points" }
    );

    setSelectedPoints(points);
    setIsOpen(false);
    onSuccess?.();
  };

  const pointOptions = [
    { value: -5, label: "-5", emoji: "😤", desc: "Mal hecha" },
    { value: -3, label: "-3", emoji: "😕", desc: "Regular" },
    { value: -1, label: "-1", emoji: "😐", desc: "Mejorable" },
    { value: 0, label: "0", emoji: "👍", desc: "Normal" },
    { value: 1, label: "+1", emoji: "😊", desc: "Bien hecha" },
    { value: 3, label: "+3", emoji: "🎉", desc: "Muy bien" },
    { value: 5, label: "+5", emoji: "⭐", desc: "Excelente" },
  ];

  const isLoading = fetcher.state === "submitting";

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`text-xs px-2 py-1 rounded-full transition-colors cursor-pointer ${
          completedTask.extraPoints !== 0
            ? completedTask.extraPoints > 0
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-red-100 text-red-700 hover:bg-red-200"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
        title="Evaluar tarea"
      >
        🎯
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Evaluar tarea</h3>
        <p className="text-sm text-gray-600 mb-4">
          ¿Qué tal estuvo <strong>{completedTask.taskName}</strong>?
        </p>

        <div className="space-y-2 mb-6">
          {pointOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSubmit(option.value)}
              disabled={isLoading}
              className={`w-full p-3 rounded-lg text-left transition-all ${
                selectedPoints === option.value
                  ? "bg-blue-100 border-2 border-blue-500"
                  : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
              } ${isLoading ? "opacity-50" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{option.emoji}</span>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {option.desc}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.label} puntos
                    </div>
                  </div>
                </div>
                {option.value === selectedPoints && (
                  <span className="text-blue-500">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
