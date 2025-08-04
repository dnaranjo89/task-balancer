import type { Route } from "./+types/task-list";
import { useTaskData } from "../hooks/useTaskData";
import { useTaskCategories } from "../hooks/useTaskStats";
import { AppLayout, DataLayout } from "../components";
import { TaskGrid } from "../components/tasks/TaskGrid";
import type { AppState } from "../types/tasks";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lista de Tareas - Task Balancer" },
    {
      name: "description",
      content: "Todas las tareas disponibles para gestionar y calificar",
    },
  ];
}

export default function TaskList() {
  const { state, loading } = useTaskData();

  return (
    <DataLayout
      data={state}
      loading={loading}
      loadingMessage="Cargando tareas..."
    >
      {(data) => <TaskListContent state={data} />}
    </DataLayout>
  );
}

function TaskListContent({ state }: { state: AppState }) {
  const tasksByCategory = useTaskCategories(state.tasks);

  return (
    <AppLayout title="Lista de Tareas" showBackButton backTo="/">
      <TaskGrid tasksByCategory={tasksByCategory} />
    </AppLayout>
  );
}
