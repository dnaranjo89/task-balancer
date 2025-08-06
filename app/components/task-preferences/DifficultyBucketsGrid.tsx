import { DroppableBucket } from "./DroppableBucket";
import { DIFFICULTY_BUCKETS } from "./constants";
import type { TaskWithRatings } from "../../types/tasks";

interface DifficultyBucketsGridProps {
  getTasksByBucket: (bucketValue: string) => TaskWithRatings[];
  draggedTask: string | null;
}

export function DifficultyBucketsGrid({
  getTasksByBucket,
  draggedTask,
}: DifficultyBucketsGridProps) {
  return (
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Niveles de Dificultad
      </h3>

      {/* Responsive grid: single column on mobile, multi-column on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {DIFFICULTY_BUCKETS.map((bucket) => (
          <DroppableBucket
            key={bucket.value}
            bucket={bucket}
            tasks={getTasksByBucket(bucket.value)}
            draggedTask={draggedTask}
          />
        ))}
      </div>
    </div>
  );
}
