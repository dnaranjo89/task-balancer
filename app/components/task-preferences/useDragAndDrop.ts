import { useMemo, useCallback } from "react";
import {
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import type { TaskWithRatings } from "../../types/tasks";

interface UseDragAndDropProps {
  tasks: TaskWithRatings[] | undefined;
  selectedPerson: string;
  preferences: Record<string, string>;
  setPreferences: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
  setDraggedTask: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useDragAndDrop({
  tasks,
  selectedPerson,
  preferences,
  setPreferences,
  setActiveId,
  setDraggedTask,
}: UseDragAndDropProps) {
  // Configure sensors at the top level (not inside useMemo)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor)
  );

  // Memoize expensive computations
  const currentPreferences = useMemo(() => {
    if (!tasks) return {};
    return tasks.reduce(
      (acc, task) => {
        const userPref = task.preferences.find(
          (p) => p.personName === selectedPerson
        );
        if (userPref) {
          acc[task.id] = userPref.preference;
        }
        return acc;
      },
      {} as Record<string, string>
    );
  }, [tasks, selectedPerson]);

  // Combine current and temporary preferences
  const allPreferences = useMemo(
    () => ({
      ...currentPreferences,
      ...preferences,
    }),
    [currentPreferences, preferences]
  );

  // Separate tasks into assigned and unassigned
  const unassignedTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter((task) => !allPreferences[task.id]);
  }, [tasks, allPreferences]);

  // Memoize bucket task calculations
  const getTasksByBucket = useCallback(
    (bucketValue: string) => {
      if (!tasks) return [];
      return tasks.filter((task) => allPreferences[task.id] === bucketValue);
    },
    [tasks, allPreferences]
  );

  // DND Kit handlers - use useCallback to prevent recreation
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveId(event.active.id as string);
      setDraggedTask(event.active.id as string);
    },
    [setActiveId, setDraggedTask]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setPreferences((prev) => ({
          ...prev,
          [active.id as string]: over.id as string,
        }));
      }

      setActiveId(null);
      setDraggedTask(null);
    },
    [setPreferences, setActiveId, setDraggedTask]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setDraggedTask(null);
  }, [setActiveId, setDraggedTask]);

  return {
    sensors,
    unassignedTasks,
    getTasksByBucket,
    handleDragStart,
    handleDragEnd,
    handleDragCancel,
  };
}
