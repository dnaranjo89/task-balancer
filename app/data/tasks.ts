import type { Task } from "../types/tasks";

export const TASKS: Task[] = [
  {
    id: "wash-dishes",
    name: "Fregar los platos",
    description: "Lavar todos los platos, vasos, cubiertos y utensilios de cocina usados",
    points: 10,
    category: "cocina",
  },
  {
    id: "take-out-trash",
    name: "Tirar la basura",
    description: "Vaciar todas las papeleras de la casa y sacar las bolsas al contenedor",
    points: 8,
    category: "limpieza",
  },
  {
    id: "clean-kitchen",
    name: "Limpiar la cocina",
    description: "Limpiar encimeras, fogones, fregadero y superficies de la cocina",
    points: 15,
    category: "cocina",
  },
  {
    id: "cook-meal",
    name: "Hacer la comida",
    description: "Preparar una comida completa para ambas personas",
    points: 20,
    category: "cocina",
  },
  {
    id: "grocery-shopping",
    name: "Hacer la compra",
    description: "Ir al supermercado y comprar todos los productos necesarios de la lista",
    points: 25,
    category: "compras",
  },
  {
    id: "change-sheets",
    name: "Cambiar las sábanas",
    description: "Quitar sábanas sucias, lavarlas y poner sábanas limpias en todas las camas",
    points: 12,
    category: "limpieza",
  },
  {
    id: "clean-bathroom",
    name: "Limpiar el baño",
    description: "Limpiar inodoro, ducha, lavabo, espejo y suelo del baño",
    points: 18,
    category: "limpieza",
  },
  {
    id: "vacuum",
    name: "Pasar la aspiradora",
    description: "Aspirar todas las habitaciones, incluyendo debajo de muebles",
    points: 15,
    category: "limpieza",
  },
  {
    id: "mop-floor",
    name: "Fregar el suelo",
    description: "Fregar con fregona todos los suelos de la casa excepto alfombras",
    points: 14,
    category: "limpieza",
  },
  {
    id: "do-laundry",
    name: "Hacer la colada",
    description: "Lavar, tender y recoger la ropa, y guardarla en los armarios",
    points: 16,
    category: "ropa",
  },
];

export const PEOPLE = ["Alba", "David"];
