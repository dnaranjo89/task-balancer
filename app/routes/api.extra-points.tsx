import { db } from "../db";
import { completedTasks } from "../db/schema";
import { eq } from "drizzle-orm";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const completedTaskId = formData.get("completedTaskId") as string;
  const extraPoints = parseInt(formData.get("extraPoints") as string);

  if (!completedTaskId || isNaN(extraPoints)) {
    return Response.json(
      { success: false, error: "Faltan datos requeridos" },
      { status: 400 }
    );
  }

  // Validar que los puntos extras estén en un rango razonable
  if (extraPoints < -10 || extraPoints > 10) {
    return Response.json(
      {
        success: false,
        error: "Los puntos extras deben estar entre -10 y +10",
      },
      { status: 400 }
    );
  }

  try {
    await db
      .update(completedTasks)
      .set({ extraPoints })
      .where(eq(completedTasks.id, parseInt(completedTaskId)));

    return Response.json({
      success: true,
      message:
        extraPoints > 0
          ? `+${extraPoints} puntos extras otorgados!`
          : extraPoints < 0
            ? `${extraPoints} puntos de penalización aplicados`
            : "Puntos extras removidos",
    });
  } catch (error) {
    console.error("Error updating extra points:", error);
    return Response.json(
      { success: false, error: "Error al actualizar los puntos extras" },
      { status: 500 }
    );
  }
}
