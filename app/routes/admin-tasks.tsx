import { useFetcher, useLoaderData, Link } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { useToast } from "../hooks/useToast";
import { ToastContainer } from "../components/ToastContainer";
import { db } from "../db";
import { tasks, categories } from "../db/schema";
import { eq } from "drizzle-orm";

interface TaskData {
  id: string;
  name: string;
  description: string | null;
  points: number;
  categoryId: string | null;
  categoryName: string | null;
  categoryEmoji: string | null;
  categoryColor: string | null;
}

interface CategoryData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  createdAt: Date;
}

interface LoaderData {
  tasks: TaskData[];
  categories: CategoryData[];
}

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

    return {
      tasks: allTasks,
      categories: allCategories,
    };
  } catch (error) {
    console.error("Error loading tasks and categories:", error);
    throw new Response("Error cargando datos", { status: 500 });
  }
}

export default function AdminTasks() {
  const { tasks, categories } = useLoaderData<LoaderData>();
  const [editingTasks, setEditingTasks] = useState<Set<string>>(new Set());
  const [taskChanges, setTaskChanges] = useState<
    Record<string, Partial<TaskData>>
  >({});
  const [isCreating, setIsCreating] = useState(false);
  const [newTask, setNewTask] = useState<Partial<TaskData>>({
    id: "",
    name: "",
    description: "",
    points: 25,
    categoryId: null,
  });
  const fetcher = useFetcher();
  const { toasts, showSuccess, showError, removeToast } = useToast();

  const isLoading = fetcher.state === "submitting";

  // Handle form submission response
  useEffect(() => {
    if (fetcher.data && fetcher.state === "idle") {
      if (fetcher.data.success) {
        showSuccess(fetcher.data.message);
        setEditingTasks(new Set());
        setTaskChanges({});
        setIsCreating(false);
        setNewTask({
          id: "",
          name: "",
          description: "",
          points: 25,
          categoryId: null,
        });
      } else {
        showError(fetcher.data.error);
      }
    }
  }, [fetcher.data, fetcher.state, showSuccess, showError]);

  const startEditing = (taskId: string) => {
    setEditingTasks((prev) => new Set([...prev, taskId]));
  };

  const cancelEditing = (taskId: string) => {
    setEditingTasks((prev) => {
      const newSet = new Set(prev);
      newSet.delete(taskId);
      return newSet;
    });
    setTaskChanges((prev) => {
      const newChanges = { ...prev };
      delete newChanges[taskId];
      return newChanges;
    });
  };

  const updateTaskField = (
    taskId: string,
    field: keyof TaskData,
    value: any
  ) => {
    setTaskChanges((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }));
  };

  const saveTask = (task: TaskData) => {
    const changes = taskChanges[task.id] || {};
    const updatedTask = { ...task, ...changes };

    fetcher.submit(
      {
        action: "update",
        id: updatedTask.id,
        name: updatedTask.name,
        description: updatedTask.description || "",
        points: updatedTask.points.toString(),
        categoryId: updatedTask.categoryId || "",
      },
      { method: "post", action: "/api/manage-tasks" }
    );
  };

  const createTask = () => {
    if (!newTask.name || !newTask.points) {
      showError("Nombre y puntos son requeridos");
      return;
    }

    const taskId = newTask.id || generateTaskId(newTask.name);

    fetcher.submit(
      {
        action: "create",
        id: taskId,
        name: newTask.name,
        description: newTask.description || "",
        points: newTask.points.toString(),
        categoryId: newTask.categoryId || "",
      },
      { method: "post", action: "/api/manage-tasks" }
    );
  };

  const deleteTask = (taskId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
      fetcher.submit(
        { action: "delete", id: taskId },
        { method: "post", action: "/api/manage-tasks" }
      );
    }
  };

  const generateTaskId = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const getTaskValue = (task: TaskData, field: keyof TaskData) => {
    return taskChanges[task.id]?.[field] ?? task[field];
  };

  const saveAllChanges = () => {
    const changesCount = Object.keys(taskChanges).length;
    if (changesCount === 0) return;

    // Save each task individually to ensure proper state management
    Object.entries(taskChanges).forEach(([taskId, changes]) => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const updatedTask = { ...task, ...changes };

        fetcher.submit(
          {
            action: "update",
            id: updatedTask.id,
            name: updatedTask.name,
            description: updatedTask.description || "",
            points: updatedTask.points.toString(),
            categoryId: updatedTask.categoryId || "",
          },
          { method: "post", action: "/api/manage-tasks" }
        );
      }
    });

    // Clear all editing state
    setEditingTasks(new Set());
    setTaskChanges({});
  };

  const cancelAllEditing = () => {
    setEditingTasks(new Set());
    setTaskChanges({});
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-6">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            🔧 Administración de Tareas
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Haz clic en cualquier campo para editarlo directamente.
            <span className="text-xs sm:text-sm text-gray-500 block mt-1">
              💡 Enter para guardar, Escape para cancelar, o simplemente haz
              clic fuera del campo
            </span>
          </p>
        </div>
        
        {/* Buttons - stacked on mobile */}
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 sm:justify-end">
          <Link 
            to="/" 
            className="text-center sm:text-left px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
          >
            ← Volver al inicio
          </Link>
          <Button 
            onClick={() => setIsCreating(!isCreating)} 
            variant="primary"
            className="w-full sm:w-auto"
          >
            {isCreating ? "❌ Cancelar" : "➕ Nueva Tarea"}
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {editingTasks.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-blue-900">
                {editingTasks.size} tarea{editingTasks.size > 1 ? "s" : ""} en
                edición
              </span>
              {Object.keys(taskChanges).length > 0 && (
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                  {Object.keys(taskChanges).length} con cambios
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={saveAllChanges}
                disabled={isLoading || Object.keys(taskChanges).length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                💾 Guardar Todo ({Object.keys(taskChanges).length})
              </button>
              <button
                onClick={cancelAllEditing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                ❌ Cancelar Todo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Puntos
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* New Task Row */}
              {isCreating && (
                <tr className="bg-blue-50 border-2 border-blue-200">
                  <td className="px-4 py-3">
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="ID (se genera automático)"
                        value={newTask.id || ""}
                        onChange={(e) =>
                          setNewTask((prev) => ({
                            ...prev,
                            id: e.target.value,
                          }))
                        }
                        className="w-full text-xs px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Nombre de la tarea"
                        value={newTask.name || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          setNewTask((prev) => ({
                            ...prev,
                            name,
                            id: prev.id || generateTaskId(name),
                          }));
                        }}
                        className="w-full text-sm font-medium px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={newTask.categoryId || ""}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          categoryId: e.target.value || null,
                        }))
                      }
                      className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Sin categoría</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.emoji} {category.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      value={newTask.points || 25}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          points: parseInt(e.target.value) || 25,
                        }))
                      }
                      min="1"
                      max="100"
                      className="w-20 px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </td>
                  <td className="px-4 py-3">
                    <textarea
                      placeholder="Descripción"
                      value={newTask.description || ""}
                      onChange={(e) =>
                        setNewTask((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={2}
                      className="w-full px-2 py-1 border rounded focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={createTask}
                        disabled={isLoading || !newTask.name}
                        className="text-green-600 hover:text-green-900 text-sm disabled:opacity-50"
                      >
                        ✅ Crear
                      </button>
                      <button
                        onClick={() => setIsCreating(false)}
                        className="text-gray-600 hover:text-gray-900 text-sm"
                      >
                        ❌ Cancelar
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Existing Tasks */}
              {tasks.map((task) => {
                const hasChanges = taskChanges[task.id];
                return (
                  <tr
                    key={task.id}
                    className={`hover:bg-gray-50 ${hasChanges ? "bg-yellow-50 border-l-4 border-yellow-400" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="space-y-2">
                        <div className="text-xs text-gray-500 font-mono">
                          {task.id}
                        </div>
                        <input
                          type="text"
                          value={getTaskValue(task, "name") as string}
                          onChange={(e) =>
                            updateTaskField(task.id, "name", e.target.value)
                          }
                          onFocus={() => startEditing(task.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveTask(task);
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              cancelEditing(task.id);
                            }
                          }}
                          className="w-full text-sm font-medium px-2 py-1 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent focus:bg-white"
                          required
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={
                          (getTaskValue(task, "categoryId") as string) || ""
                        }
                        onChange={(e) => {
                          startEditing(task.id);
                          updateTaskField(
                            task.id,
                            "categoryId",
                            e.target.value || null
                          );
                        }}
                        className="w-full px-2 py-1 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent focus:bg-white text-sm appearance-none cursor-pointer"
                      >
                        <option value="">Sin categoría</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.emoji} {category.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={getTaskValue(task, "points") as number}
                        onChange={(e) => {
                          startEditing(task.id);
                          updateTaskField(
                            task.id,
                            "points",
                            parseInt(e.target.value) || task.points
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            saveTask(task);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            cancelEditing(task.id);
                          }
                        }}
                        min="1"
                        max="100"
                        className="w-20 px-2 py-1 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent focus:bg-white text-sm"
                        required
                      />
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        value={
                          (getTaskValue(task, "description") as string) || ""
                        }
                        onChange={(e) => {
                          startEditing(task.id);
                          updateTaskField(
                            task.id,
                            "description",
                            e.target.value
                          );
                        }}
                        rows={2}
                        className="w-full px-2 py-1 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 bg-transparent focus:bg-white text-sm resize-none"
                        placeholder="Descripción"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        {hasChanges ? (
                          <>
                            <button
                              onClick={() => saveTask(task)}
                              disabled={isLoading}
                              className="text-green-600 hover:text-green-900 text-sm disabled:opacity-50 p-1 hover:bg-green-50 rounded"
                              title="Guardar cambios"
                            >
                              ✅
                            </button>
                            <button
                              onClick={() => cancelEditing(task.id)}
                              className="text-gray-600 hover:text-gray-900 text-sm p-1 hover:bg-gray-50 rounded"
                              title="Deshacer cambios"
                            >
                              ↶
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => deleteTask(task.id)}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50 p-1 hover:bg-red-50 rounded"
                            title="Eliminar tarea"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay tareas configuradas</p>
          <Button
            onClick={() => setIsCreating(true)}
            variant="primary"
            className="mt-4"
          >
            Crear primera tarea
          </Button>
        </div>
      )}

      <div className="mt-8 text-sm text-gray-600">
        <p>
          <strong>Total de tareas:</strong> {tasks.length}
        </p>
        <p>
          <strong>Categorías disponibles:</strong> {categories.length}
        </p>
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}
