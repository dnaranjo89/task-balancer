import React from "react";
import { LoadingState, ErrorState } from "../index";

interface DataLayoutProps<T> {
  data: T | null;
  loading: boolean;
  error?: Error | null;
  children: (data: T) => React.ReactNode;
  loadingMessage?: string;
  errorMessage?: string;
}

export function DataLayout<T>({
  data,
  loading,
  error,
  children,
  loadingMessage,
  errorMessage,
}: DataLayoutProps<T>) {
  if (loading) {
    return <LoadingState message={loadingMessage} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Error"
        message={errorMessage || "Error al cargar los datos"}
      />
    );
  }

  if (!data) {
    return (
      <ErrorState title="Error" message="No se pudieron cargar los datos" />
    );
  }

  return <>{children(data)}</>;
}
