import { useState } from "react";
import { Button } from "./Button";
import type { TaskRating, Person } from "../types/tasks";

interface PersonRatingCardProps {
  person: Person;
  existingRating?: TaskRating;
  onSubmitRating: (personName: string, points: number) => void;
}

export function PersonRatingCard({
  person,
  existingRating,
  onSubmitRating,
}: PersonRatingCardProps) {
  const [currentRating, setCurrentRating] = useState(
    existingRating?.points || 5
  );

  const handleSubmit = () => {
    if (currentRating >= 1 && currentRating <= 50) {
      onSubmitRating(person.name, currentRating);
      // No resetear el valor - mantener la selección del usuario
    }
  };

  const isValidRating = currentRating >= 1 && currentRating <= 50;
  const hasChanged = currentRating !== (existingRating?.points || 5);

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h4 className="font-semibold text-lg text-gray-800 mb-3">
        {person.name}
      </h4>

      {existingRating && (
        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-green-800">Valoración actual:</span>
            <span className="font-bold text-green-600">
              {existingRating.points} puntos
            </span>
          </div>
          <div className="text-xs text-green-600 mt-1">
            {new Date(existingRating.createdAt).toLocaleDateString("es-ES")}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {existingRating ? "Nueva valoración:" : "Asignar puntos:"}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={currentRating || 1}
            onChange={(e) => setCurrentRating(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span className="font-semibold text-blue-600">
              {currentRating || 1} puntos
            </span>
            <span>50</span>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          variant="primary"
          size="small"
          disabled={!isValidRating || !hasChanged}
          className="w-full"
        >
          {existingRating ? "Actualizar valoración" : "Guardar valoración"}
        </Button>
      </div>
    </div>
  );
}
