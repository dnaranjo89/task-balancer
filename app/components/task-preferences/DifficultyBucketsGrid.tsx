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

      {/* Mobile: Single column, larger touch targets */}
      <div className="md:hidden space-y-4">
        {DIFFICULTY_BUCKETS.map((bucket) => (
          <DroppableBucket
            key={bucket.value}
            bucket={bucket}
            tasks={getTasksByBucket(bucket.value)}
            draggedTask={draggedTask}
            isMobile={true}
          />
        ))}
      </div>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4">
        {DIFFICULTY_BUCKETS.map((bucket) => (
          <DroppableBucket
            key={bucket.value}
            bucket={bucket}
            tasks={getTasksByBucket(bucket.value)}
            draggedTask={draggedTask}
            isMobile={false}
          />
        ))}
      </div>
    </div>
  );
}
