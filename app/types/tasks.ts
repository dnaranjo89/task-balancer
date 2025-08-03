export interface Task {
  id: string;
  name: string;
  points: number;
  category?: string;
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
}
