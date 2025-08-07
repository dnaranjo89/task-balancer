export function Instructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 mb-6">
      <h3 className="text-lg font-bold text-blue-800 mb-2">📝 Instrucciones</h3>
      <div className="text-blue-700 space-y-2">
        <p className="md:hidden">
          <strong>En móvil:</strong> Mantén presionada una tarea y arrástrala
          hacia el nivel de dificultad correspondiente. La preferencia se guarda automáticamente.
        </p>
        <p className="hidden md:block">
          Arrastra las tareas hacia el bucket que mejor describa qué tan difícil te resulta cada una. 
          Las tareas más difíciles obtendrán más puntos, las más fáciles menos puntos. 
          Las preferencias se guardan automáticamente al soltar cada tarea.
        </p>
      </div>
    </div>
  );
}
