import { redirect } from "react-router";
import { rateTask } from "../server/taskStore";

export async function action({ request, params }: { request: Request; params: { taskId: string } }) {
  const formData = await request.formData();
  const personName = formData.get("personName") as string;
  const points = parseInt(formData.get("points") as string);
  const taskId = params.taskId;

  if (!personName || !points || !taskId) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const rating = rateTask(taskId, personName, points);
    return Response.json({ success: true, rating });
  } catch (error) {
    return Response.json({ error: "Failed to rate task" }, { status: 500 });
  }
}
