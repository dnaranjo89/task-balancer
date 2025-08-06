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
  isMobile?: boolean;
}

export interface DroppableBucketProps {
  bucket: DifficultyBucket;
  tasks: TaskWithRatings[];
  isOver?: boolean;
  draggedTask: string | null;
  isMobile?: boolean;
}
