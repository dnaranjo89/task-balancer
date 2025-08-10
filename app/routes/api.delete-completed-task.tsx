import { db } from "../db";
import { completedTasks } from "../db/schema";
import { eq } from "drizzle-orm";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const completedTaskId = formData.get("completedTaskId") as string;

  if (!completedTaskId) {
    return Response.json(
      { success: false, error: "ID de tarea completada requerido" },
      { status: 400 }
    );
  }

  try {
    // Eliminar la tarea completada de la base de datos
    await db
      .delete(completedTasks)
      .where(eq(completedTasks.id, parseInt(completedTaskId)));

    return Response.json({
      success: true,
      message: "Tarea completada eliminada correctamente",
    });
  } catch (error) {
    console.error("Error deleting completed task:", error);
    return Response.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
