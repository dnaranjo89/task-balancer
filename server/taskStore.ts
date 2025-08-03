import type { AppState, CompletedTask, Person } from "../app/types/tasks";
import { PEOPLE } from "../app/data/tasks";

// Estado en memoria del servidor
let serverState: AppState = {
  people: PEOPLE.map((name) => ({ name, totalPoints: 0 })),
  completedTasks: [],
};

export function getState(): AppState {
  return serverState;
}

export function completeTask(
  personName: string,
  taskId: string,
  taskName: string,
  points: number
): CompletedTask {
  const newCompletedTask: CompletedTask = {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    taskId,
    personName,
    taskName,
    points,
    completedAt: new Date(),
  };

  serverState = {
    ...serverState,
    people: serverState.people.map((person) =>
      person.name === personName
        ? { ...person, totalPoints: person.totalPoints + points }
        : person
    ),
    completedTasks: [newCompletedTask, ...serverState.completedTasks],
  };

  return newCompletedTask;
}

export function resetData(): void {
  serverState = {
    people: PEOPLE.map((name) => ({ name, totalPoints: 0 })),
    completedTasks: [],
  };
}
