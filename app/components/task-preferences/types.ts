import type { TaskWithRatings } from "../../types/tasks";

export interface DifficultyBucket {
  value: string;
  label: string;
  emoji: string;
  modifier: number;
  color: string;
  description: string;
}

export interface DraggableTaskProps {
  task: TaskWithRatings;
  isDragging?: boolean;
  isInOverlay?: boolean;
}

export interface DroppableBucketProps {
  bucket: DifficultyBucket;
  tasks: TaskWithRatings[];
  draggedTask: string | null;
}
