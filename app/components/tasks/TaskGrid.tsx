import React from "react";
import { Link } from "react-router";
import { Button } from "../index";
import type { Task } from "../../types/tasks";

interface TaskGridProps {
  tasksByCategory: Record<string, Task[]>;
}

export function TaskGrid({ tasksByCategory }: TaskGridProps) {
  return (
    <div className="space-y-8">
      {Object.entries(tasksByCategory).map(([category, tasks]) => (
        <TaskCategorySection key={category} category={category} tasks={tasks} />
      ))}
    </div>
  );
}

interface TaskCategorySectionProps {
  category: string;
  tasks: Task[];
}

function TaskCategorySection({ category, tasks }: TaskCategorySectionProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4 capitalize">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
}

function TaskCard({ task }: TaskCardProps) {
  // Check if task has ratings (it's a TaskWithRatings)
  const taskWithRatings = task as any;
  const hasRatings =
    taskWithRatings.ratings && taskWithRatings.ratings.length > 0;

  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-800 text-lg">{task.name}</h3>
          <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-medium">
            {task.points} pts
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
        <TaskStats task={taskWithRatings} hasRatings={hasRatings} />
      </div>
    </Link>
  );
}

interface TaskStatsProps {
  task: any;
  hasRatings: boolean;
}

function TaskStats({ task, hasRatings }: TaskStatsProps) {
  return (
    <div className="flex justify-between items-center text-xs text-gray-500">
      <span>
        {hasRatings
          ? `${task.ratings.length} valoración${task.ratings.length !== 1 ? "es" : ""}`
          : "Sin valoraciones"}
      </span>
      <span>
        {hasRatings
          ? `Media: ${task.averagePoints} pts`
          : `Por defecto: ${task.points} pts`}
      </span>
    </div>
  );
}
