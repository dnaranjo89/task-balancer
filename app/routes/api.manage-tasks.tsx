import { db } from "../db";
import { tasks, categories } from "../db/schema";
import { eq } from "drizzle-orm";

export async function loader() {
  try {
    // Get all tasks with their categories
    const allTasks = await db
      .select({
        id: tasks.id,
        name: tasks.name,
        description: tasks.description,
        points: tasks.points,
        categoryId: tasks.categoryId,
        categoryName: categories.name,
        categoryEmoji: categories.emoji,
        categoryColor: categories.color,
      })
      .from(tasks)
      .leftJoin(categories, eq(tasks.categoryId, categories.id))
      .orderBy(tasks.name);

    // Get all categories
    const allCategories = await db
      .select()
      .from(categories)
      .orderBy(categories.name);

    return Response.json({
      tasks: allTasks,
      categories: allCategories,
    });
  } catch (error) {
    console.error("Error loading tasks and categories:", error);
    return Response.json(
      { success: false, error: "Error cargando datos" },
      { status: 500 }
    );
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const action = formData.get("action") as string;

  try {
    if (action === "create") {
      const id = formData.get("id") as string;
      const name = formData.get("name") as string;
      const description = formData.get("description") as string;
      const points = parseInt(formData.get("points") as string);
      const categoryId = formData.get("categoryId") as string;

      if (!id || !name || !points) {
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
        categoryId: categoryId || null,
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
      const categoryId = formData.get("categoryId") as string;

      if (!id || !name || !points) {
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
          categoryId: categoryId || null,
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

    if (action === "batch-update") {
      // Extract all task updates from form data
      const taskUpdates: any[] = [];
      const taskIds = new Set<string>();
      
      // Parse the nested form data structure
      for (const [key, value] of formData.entries()) {
        if (key.startsWith('tasks[') && key.includes('][')) {
          const matches = key.match(/tasks\[([^\]]+)\]\[([^\]]+)\]/);
          if (matches) {
            const [, taskId, field] = matches;
            taskIds.add(taskId);
          }
        }
      }

      // Process each task update
      for (const taskId of taskIds) {
        const name = formData.get(`tasks[${taskId}][name]`) as string;
        const description = formData.get(`tasks[${taskId}][description]`) as string;
        const points = parseInt(formData.get(`tasks[${taskId}][points]`) as string);
        const categoryId = formData.get(`tasks[${taskId}][categoryId]`) as string;

        if (name && points) {
          await db
            .update(tasks)
            .set({
              name,
              description: description || "",
              points,
              categoryId: categoryId || null,
            })
            .where(eq(tasks.id, taskId));
        }
      }

      return Response.json({
        success: true,
        message: `${taskIds.size} tareas actualizadas correctamente`,
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
