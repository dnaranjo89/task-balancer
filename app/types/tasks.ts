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

export interface TaskWithRatings extends Task {
  ratings: TaskRating[];
  averagePoints: number;
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
