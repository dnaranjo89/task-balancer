export interface Task {
  id: string;
  name: string;
  description?: string;
  points: number;
  category?: string;
}

export interface TaskRating {
  id: string;
  taskId: string;
  personName: string;
  points: number;
  createdAt: Date;
}

export interface TaskPreference {
  id: string;
  taskId: string;
  personName: string;
  preference:
    | "odio"
    | "me_cuesta"
    | "indiferente"
    | "no_me_cuesta"
    | "me_gusta";
  pointsModifier: number; // +10, +5, 0, -5, -10
  createdAt: Date;
}

export interface TaskWithRatings extends Task {
  ratings: TaskRating[];
  preferences: TaskPreference[];
  basePoints: number; // Media de las valoraciones o 25 por defecto
  finalPoints: number; // basePoints + suma de preferencias
  averagePoints: number; // Para compatibilidad hacia atrás
}

export interface CompletedTask {
  id: string;
  taskId: string;
  personName: string;
  taskName: string;
  points: number;
  completedAt: Date;
}

export interface Person {
  name: string;
  totalPoints: number;
}

export interface AppState {
  people: Person[];
  completedTasks: CompletedTask[];
  tasks: TaskWithRatings[];
}
