// Category configuration with emojis and colors
export const CATEGORY_CONFIG = {
  salon: {
    emoji: "🛋️",
    label: "Salón",
    color: "bg-indigo-50 border-indigo-200",
  },
  cocina: {
    emoji: "🍳",
    label: "Cocina",
    color: "bg-orange-50 border-orange-200",
  },
  comida: {
    emoji: "🍽️",
    label: "Comida",
    color: "bg-yellow-50 border-yellow-200",
  },
  limpieza: {
    emoji: "🧹",
    label: "Limpieza",
    color: "bg-blue-50 border-blue-200",
  },
  ropa: { emoji: "👕", label: "Ropa", color: "bg-purple-50 border-purple-200" },
  habitacion: {
    emoji: "🛏️",
    label: "Habitación",
    color: "bg-pink-50 border-pink-200",
  },
  "sin categoría": {
    emoji: "📝",
    label: "Sin Categoría",
    color: "bg-gray-50 border-gray-200",
  },
};

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
