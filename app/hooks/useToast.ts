import { useState, useCallback } from "react";

interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info") => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastData = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message: string) => {
    showToast(message, "success");
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, "error");
  }, [showToast]);

  const showInfo = useCallback((message: string) => {
    showToast(message, "info");
  }, [showToast]);

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    removeToast
  };
}
