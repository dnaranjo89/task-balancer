import { redirect } from "react-router";
import { getState, completeTask, resetData } from "../server/taskStore";

export async function loader() {
  const state = await getState();
  return Response.json(state);
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const action = formData.get("action") as string;

  if (action === "complete") {
    const personName = formData.get("personName") as string;
    const taskId = formData.get("taskId") as string;
    const taskName = formData.get("taskName") as string;
    const points = parseInt(formData.get("points") as string);

    await completeTask(personName, taskId, taskName, points);
    // Redirigir al home después de completar una tarea
    return redirect("/");
  }

  if (action === "complete-multiple") {
    const personName = formData.get("personName") as string;
    const tasksData = formData.get("tasks") as string;

    if (!tasksData) {
      return Response.json({ error: "No tasks provided" }, { status: 400 });
    }

    const tasks = JSON.parse(tasksData);

    // Completar todas las tareas
    for (const task of tasks) {
      await completeTask(personName, task.id, task.name, task.points);
    }

    // Redirigir al home después de completar las tareas
    return redirect("/");
  }

  if (action === "reset") {
    await resetData();
    // Redirigir al home después de resetear (o quedarse en la misma página)
    return redirect("/");
  }

  return Response.json({ error: "Invalid action" }, { status: 400 });
}
