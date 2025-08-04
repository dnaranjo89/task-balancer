interface LoadingStateProps {
  message?: string;
  gradient?: string;
}

export function LoadingState({
  message = "Cargando...",
  gradient = "from-purple-50 to-pink-100",
}: LoadingStateProps) {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradient} flex items-center justify-center`}
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{message}</h1>
      </div>
    </div>
  );
}
