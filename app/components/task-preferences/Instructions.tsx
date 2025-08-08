export function Instructions() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 md:p-6 mb-6">
      <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
        <span className="mr-2">🎯</span>
        Cómo clasificar las tareas
      </h3>
      <div className="text-blue-700 space-y-3">
        <div className="md:hidden bg-white/70 rounded-lg p-3 border border-blue-100">
          <p className="font-semibold text-blue-800 mb-1">📱 En móvil:</p>
          <p className="text-sm">
            • Mantén presionada una tarea con el ícono{" "}
            <span className="font-mono bg-gray-100 px-1 rounded">⋮⋮</span>
            <br />
            • Arrástrala hacia la categoría correspondiente
            <br />• Se guarda automáticamente al soltar
          </p>
        </div>
        <div className="hidden md:block bg-white/70 rounded-lg p-3 border border-blue-100">
          <p className="font-semibold text-blue-800 mb-1">🖥️ En computadora:</p>
          <p className="text-sm">
            • Busca las tareas con borde punteado y el ícono{" "}
            <span className="font-mono bg-gray-100 px-1 rounded">
              ⋮⋮ ARRASTRA
            </span>
            <br />
            • Arrastra cada tarea hacia el bucket que mejor la describa
            <br />• Las tareas más difíciles obtendrán más puntos
          </p>
        </div>
        <div className="text-xs text-blue-600 bg-blue-100/50 rounded p-2">
          💡 <strong>Tip:</strong> Las preferencias se guardan automáticamente -
          no hay botón guardar
        </div>
      </div>
    </div>
  );
}
