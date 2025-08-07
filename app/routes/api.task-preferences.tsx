import { redirect } from "react-router";
import { setTaskPreference } from "../server/taskStore";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const action = formData.get("action") as string;
  
  console.log("Action received:", action);
  console.log("All form data:", [...formData.entries()]);

  if (action === "set_multiple_preferences") {
    const personName = formData.get("personName") as string;
    const preferencesJson = formData.get("preferences") as string;
    
    if (!personName || !preferencesJson) {
      console.log("Missing fields for multiple preferences:", { personName, preferencesJson });
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Faltan datos requeridos" 
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const preferences = JSON.parse(preferencesJson) as Record<string, string>;
      console.log("Parsed preferences:", preferences);
      console.log("Number of preferences to save:", Object.keys(preferences).length);
      
      // Set preferences for each task
      for (const [taskId, preference] of Object.entries(preferences)) {
        if (preference) { // Save all valid preferences, including 'indiferente'
          await setTaskPreference(
            taskId, 
            personName, 
            preference as 'odio' | 'me_cuesta' | 'indiferente' | 'no_me_cuesta' | 'me_gusta'
          );
          console.log(`Saved preference for task ${taskId}: ${preference}`);
        }
      }
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    } catch (error) {
      console.error("Error parsing preferences or setting them:", error);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Error al procesar las preferencias" 
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  // Handle single preference (legacy support)
  const taskId = formData.get("taskId") as string;
  const personName = formData.get("personName") as string;
  const preference = formData.get("preference") as
    | "odio"
    | "me_cuesta"
    | "indiferente"
    | "no_me_cuesta"
    | "me_gusta";

  if (!taskId || !personName || !preference) {
    console.log("Missing fields for single preference:", { taskId, personName, preference });
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Faltan datos requeridos" 
    }), { 
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    await setTaskPreference(taskId, personName, preference);
    return redirect("/task-preferences");
  } catch (error) {
    console.error("Error setting task preference:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: "Error al guardar la preferencia" 
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
