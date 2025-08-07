import { DIFFICULTY_BUCKETS } from "./constants";

interface MobilePreferenceSelectorProps {
  selectedTask: string | null;
  onPreferenceSelect: (preference: string) => void;
  taskName?: string;
}

export function MobilePreferenceSelector({
  selectedTask,
  onPreferenceSelect,
  taskName,
}: MobilePreferenceSelectorProps) {
  if (!selectedTask) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
        <div className="text-3xl mb-2">👆</div>
        <h3 className="text-lg font-semibold text-blue-800 mb-1">
          Selecciona una tarea
        </h3>
        <p className="text-sm text-blue-600">
          Toca cualquier tarea arriba para moverla a una categoría
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-blue-300 rounded-xl p-4 shadow-lg">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          ¿A qué categoría va esta tarea?
        </h3>
        <p className="text-sm text-blue-600 font-medium mt-1">"{taskName}"</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {DIFFICULTY_BUCKETS.map((bucket) => (
          <button
            key={bucket.value}
            onClick={() => onPreferenceSelect(bucket.value)}
            className={`p-3 rounded-lg border-2 text-left transition-all hover:scale-105 active:scale-95 ${bucket.color} hover:shadow-md`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-xl">{bucket.emoji}</span>
              <div>
                <div className="font-semibold text-gray-800 text-sm">
                  {bucket.label}
                </div>
                <div className="text-xs text-gray-600">
                  {bucket.description}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => onPreferenceSelect("")}
        className="w-full mt-3 p-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        ✕ Cancelar
      </button>
    </div>
  );
}
