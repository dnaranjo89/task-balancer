import type { TaskWithRatings } from "../../types/tasks";
import type { CATEGORY_CONFIG } from "./constants";

export interface SelectableTask extends TaskWithRatings {
  selected: boolean;
}

export type SelectionMode = "single" | "multiple";

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
