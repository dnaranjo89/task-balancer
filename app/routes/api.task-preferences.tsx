import { eq, and } from "drizzle-orm";
import type { Route } from "./+types/api.task-preferences";
import { db } from "../db";
import { taskPreferences } from "../db/schema";

export async function action({ request }: Route.ActionArgs) {
  try {
    const formData = await request.formData();
    const personName = formData.get("personName") as string;
    const preferencesJson = formData.get("preferences") as string;

    if (!personName || !preferencesJson) {
      return Response.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    const preferences = JSON.parse(preferencesJson) as Record<string, number>;

    // Eliminar preferencias existentes para esta persona
    await db
      .delete(taskPreferences)
      .where(eq(taskPreferences.personName, personName));

    // Insertar nuevas preferencias
    const preferencesToInsert = Object.entries(preferences).map(
      ([taskId, level]) => ({
        taskId,
        personName,
        preferenceLevel: level,
      })
    );

    if (preferencesToInsert.length > 0) {
      await db.insert(taskPreferences).values(preferencesToInsert);
    }

    return Response.json({
      success: true,
      message: `Preferencias guardadas para ${personName}`,
      count: preferencesToInsert.length,
    });
  } catch (error) {
    console.error("Error saving task preferences:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const url = new URL(request.url);
    const personName = url.searchParams.get("personName");

    if (!personName) {
      return Response.json({ preferences: {} });
    }

    const userPreferences = await db
      .select()
      .from(taskPreferences)
      .where(eq(taskPreferences.personName, personName));

    const preferences = userPreferences.reduce(
      (acc, pref) => {
        acc[pref.taskId] = pref.preferenceLevel;
        return acc;
      },
      {} as Record<string, number>
    );

    return Response.json({ preferences });
  } catch (error) {
    console.error("Error loading task preferences:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
