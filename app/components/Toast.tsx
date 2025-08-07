import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500", 
    info: "bg-blue-500"
  }[type];

  const icon = {
    success: "✅",
    error: "❌",
    info: "ℹ️"
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-2 text-white hover:text-gray-200 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
