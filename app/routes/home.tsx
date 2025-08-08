import type { Route } from "./+types/home";
import { Link } from "react-router";
import { useTaskData } from "../hooks/useTaskData";
import { usePersonStats } from "../hooks/useTaskStats";
import { Button, DataLayout } from "../components";
import type { AppState } from "../types/tasks";
import DropableDemo, {
  DroppableStory,
} from "~/components/task-preferences/DropableDemo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Balancer - Gestión de Tareas" },
    {
      name: "description",
      content: "Aplicación para gestionar tareas entre compañeros de piso",
    },
  ];
}

export default function Home() {
  const { state, loading } = useTaskData();

  return (
    <DataLayout
      data={state}
      loading={loading}
      loadingMessage="Cargando Task Balancer..."
    >
      {(data) => <HomeContent state={data} />}
    </DataLayout>
  );
}

function HomeContent({ state }: { state: AppState }) {
  const personStats = usePersonStats(state);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Task Balancer</h1>
        <p className="text-xl text-gray-600 mb-12">
          ¿Quién va a realizar una tarea?
        </p>

        {/* Botones de personas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {personStats.map((person) => (
            <Link
              key={person.name}
              to={`/${encodeURIComponent(person.name.toLowerCase())}/does`}
              className="block"
            >
              <Button
                onClick={() => {}}
                variant="primary"
                size="large"
                className="h-32 text-2xl flex flex-col justify-center w-full"
              >
                <div>{person.name}</div>
                <div className="text-lg opacity-80">
                  {person.totalPoints} puntos
                </div>
                <div className="text-sm opacity-60">
                  {person.completedTasksCount} tareas completadas
                </div>
              </Button>
            </Link>
          ))}
        </div>

        {/* Botones de navegación */}
        <div className="space-y-4">
          {/* temporary hide this option   */}
          {/* <Link to="/tasks" className="block">
            <Button
              onClick={() => {}}
              variant="primary"
              size="large"
              className="w-full max-w-md"
            >
              📋 Gestionar Tareas
            </Button>
          </Link> */}

          {/* <DroppableStory containers={["A", "B", "C"]} /> */}

          <Link to="/task-preferences" className="block">
            <Button
              onClick={() => {}}
              variant="primary"
              size="large"
              className="w-full max-w-md"
            >
              ⚙️ Preferencias de Tareas
            </Button>
          </Link>

          <Link to="/scoreboard" className="block">
            <Button
              onClick={() => {}}
              variant="secondary"
              size="large"
              className="w-full max-w-md"
            >
              📊 Ver Puntuaciones
            </Button>
          </Link>

          {/* Reset UI removed; keep npm db:reset for maintenance */}
        </div>
      </div>
    </div>
  );
}
