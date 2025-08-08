import { db } from "../db";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const action = formData.get("action") as string;

  try {
    if (action === "create") {
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const points = parseInt(formData.get("points") as string);
      const category = formData.get("category") as string;

      if (!id || !name || !points || !category) {
        return Response.json(
          { success: false, error: "Faltan campos requeridos" },
          { status: 400 }
        );
      }

      await db.insert(tasks).values({
        id,
        name,
        description: description || "",
        points,
        category,
      });

      return Response.json({
        success: true,
        message: "Tarea creada correctamente",
      });
    }

    if (action === "update") {
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const points = parseInt(formData.get("points") as string);
      const category = formData.get("category") as string;

      if (!id || !name || !points || !category) {
        return Response.json(
          { success: false, error: "Faltan campos requeridos" },
          { status: 400 }
        );
      }

      await db
        .update(tasks)
        .set({
          name,
          description: description || "",
          points,
          category,
        })
        .where(eq(tasks.id, id));

      return Response.json({
        success: true,
        message: "Tarea actualizada correctamente",
      });
    }

    if (action === "delete") {
      const id = formData.get("id") as string;

      if (!id) {
        return Response.json(
          { success: false, error: "ID de tarea requerido" },
          { status: 400 }
        );
      }

      await db.delete(tasks).where(eq(tasks.id, id));

      return Response.json({
        success: true,
        message: "Tarea eliminada correctamente",
      });
    }

    return Response.json(
      { success: false, error: "Acción no válida" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error managing task:", error);
    return Response.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
