import { useMemo } from "react";
import type { AppState, Task } from "../types/tasks";

export function useTaskCategories(tasks: Task[]) {
  return useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        const category = task.category || "Sin categoría";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(task);
        return acc;
      },
      {} as Record<string, Task[]>
    );
  }, [tasks]);
}

export function usePersonStats(state: AppState) {
  return useMemo(() => {
    return state.people.map((person) => {
      const completedTasks = state.completedTasks.filter(
        (task) => task.personName === person.name
      );

      return {
        ...person,
        completedTasksCount: completedTasks.length,
        averageRating:
          completedTasks.length > 0
            ? completedTasks.reduce((sum, task) => sum + task.points, 0) /
              completedTasks.length
            : 0,
        recentTasks: completedTasks
          .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
          .slice(0, 5),
      };
    });
  }, [state.people, state.completedTasks]);
}

export function useTaskStats(tasks: Task[]) {
  return useMemo(() => {
    const totalTasks = tasks.length;
    const categoriesCount = new Set(tasks.map((task) => task.category)).size;
    const averagePoints =
      tasks.length > 0
        ? tasks.reduce((sum, task) => sum + task.points, 0) / tasks.length
        : 0;

    return {
      totalTasks,
      categoriesCount,
      averagePoints: Math.round(averagePoints * 10) / 10,
    };
  }, [tasks]);
}
