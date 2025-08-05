import type { DifficultyBucket } from "./types";

export const DIFFICULTY_BUCKETS: DifficultyBucket[] = [
  {
    value: "odio",
    label: "Lo detesto",
    emoji: "🤮",
    modifier: 10,
    color: "bg-red-500",
    description: "Me cuesta mucho trabajo",
  },
  {
    value: "me_cuesta",
    label: "Me cuesta",
    emoji: "😮‍💨",
    modifier: 5,
    color: "bg-orange-400",
    description: "Requiere esfuerzo",
  },
  {
    value: "indiferente",
    label: "Normal",
    emoji: "😐",
    modifier: 0,
    color: "bg-gray-400",
    description: "Ni fácil ni difícil",
  },
  {
    value: "no_me_cuesta",
    label: "Fácil",
    emoji: "😊",
    modifier: -5,
    color: "bg-green-400",
    description: "Me resulta sencillo",
  },
  {
    value: "me_gusta",
    label: "Me encanta",
    emoji: "🤩",
    modifier: -10,
    color: "bg-green-600",
    description: "Disfruto haciéndolo",
  },
];
