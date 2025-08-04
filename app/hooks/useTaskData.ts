import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useRevalidator } from "react-router";
import type { AppState } from "../types/tasks";

export function useTaskData() {
  const fetcher = useFetcher();
  const revalidator = useRevalidator();

  // Para cargar datos iniciales, usaremos un loader en las páginas que lo necesiten
  const [state, setState] = useState<AppState | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del servidor al inicializar
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (response.ok) {
          const serverState = await response.json();
          // Convertir fechas de string a Date
          serverState.completedTasks = serverState.completedTasks.map(
            (task: any) => ({
              ...task,
              completedAt: new Date(task.completedAt),
            })
          );
          setState(serverState);
        }
      } catch (error) {
        console.error("Error loading data from server:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Recargar datos cuando se complete una acción (cualquier fetcher action)
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data !== undefined) {
      // Recargar datos después de cualquier acción
      const loadData = async () => {
        try {
          const response = await fetch("/api/tasks");
          if (response.ok) {
            const serverState = await response.json();
            serverState.completedTasks = serverState.completedTasks.map(
              (task: any) => ({
                ...task,
                completedAt: new Date(task.completedAt),
              })
            );
            setState(serverState);
          }
        } catch (error) {
          console.error("Error reloading data:", error);
        }
      };
      loadData();
    }
  }, [fetcher.state, fetcher.data]);

  return {
    state,
    loading,
    fetcher,
  };
}
