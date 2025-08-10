import { useState, useMemo } from "react";
import { useFetcher } from "react-router";
import { ModeToggle } from "./ModeToggle";
import { MultipleSelectionControls } from "./MultipleSelectionControls";
import { TaskCategoryGroup } from "./TaskCategoryGroup";
import type { SelectableTask, SelectionMode } from "./types";
import type { TaskWithRatings } from "../../types/tasks";

interface MultipleTaskSelectorProps {
  tasks: TaskWithRatings[];
  personName: string;
}

export function MultipleTaskSelector({
  tasks,
  personName,
}: MultipleTaskSelectorProps) {
  const [selectableTasks, setSelectableTasks] = useState<SelectableTask[]>(
    tasks.map((task) => ({ ...task, selected: false }))
  );
  const [mode, setMode] = useState<SelectionMode>("single");
  const fetcher = useFetcher();

  // Group tasks by category
  const tasksByCategory = useMemo(() => {
    return selectableTasks.reduce(
      (acc, task) => {
        const category = task.category || "sin categoría";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(task);
        return acc;
      },
      {} as Record<string, SelectableTask[]>
    );
  }, [selectableTasks]);

  const toggleTaskSelection = (taskId: string) => {
    setSelectableTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const toggleSelectAll = () => {
    const allSelected = selectableTasks.every((task) => task.selected);
    setSelectableTasks((prev) =>
      prev.map((task) => ({ ...task, selected: !allSelected }))
    );
  };

  const toggleCategorySelection = (category: string) => {
    const categoryTasks = tasksByCategory[category];
    const allCategorySelected = categoryTasks.every((task) => task.selected);

    setSelectableTasks((prev) =>
      prev.map((task) =>
        task.category === category ||
        (category === "sin categoría" && !task.category)
          ? { ...task, selected: !allCategorySelected }
          : task
      )
    );
  };

  const selectedTasks = selectableTasks.filter((task) => task.selected);
  const totalPoints = selectedTasks.reduce(
    (sum, task) => sum + task.finalPoints,
    0
  );

  const handleSubmitMultiple = () => {
    if (selectedTasks.length === 0) return;

    const tasksData = selectedTasks.map((task) => ({
      id: task.id,
      name: task.name,
      points: task.finalPoints,
    }));

    fetcher.submit(
      {
        action: "complete-multiple",
        personName,
        tasks: JSON.stringify(tasksData),
      },
      { method: "post", action: "/api/tasks" }
    );
  };

  const handleSubmitSingle = (task: TaskWithRatings) => {
    fetcher.submit(
      {
        action: "complete",
        personName,
        taskId: task.id,
        taskName: task.name,
        points: task.finalPoints.toString(),
      },
      { method: "post", action: "/api/tasks" }
    );
  };

  const isLoading = fetcher.state === "submitting";

  return (
    <div className="space-y-6">
      <ModeToggle mode={mode} onModeChange={setMode} />

      {mode === "multiple" && (
        <MultipleSelectionControls
          selectableTasks={selectableTasks}
          selectedTasks={selectedTasks}
          totalPoints={totalPoints}
          tasksByCategory={tasksByCategory}
          onToggleSelectAll={toggleSelectAll}
          onSubmitMultiple={handleSubmitMultiple}
          isLoading={isLoading}
        />
      )}

      {/* Task Grid - Grouped by Categories */}
      <div className="space-y-6">
        {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
          <TaskCategoryGroup
            key={category}
            category={category}
            categoryTasks={categoryTasks}
            mode={mode}
            onToggleCategorySelection={toggleCategorySelection}
            onToggleTaskSelection={toggleTaskSelection}
            onSubmitSingle={handleSubmitSingle}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
