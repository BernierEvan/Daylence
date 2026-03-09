// ═══════════════════════════════════════════════
// Daylence Todos — Type Definitions
// ═══════════════════════════════════════════════

// ── Core Todo ──
export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string; // ISO date
  createdAt: string;
}

// ── Grocery ──
export const AISLES = [
  "Fruits & Légumes",
  "Boucherie & Poissonnerie",
  "Produits laitiers",
  "Boulangerie",
  "Épicerie",
  "Boissons",
  "Surgelés",
  "Hygiène",
  "Autres",
] as const;

export type Aisle = (typeof AISLES)[number];

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price?: number;
  aisle: Aisle;
  checked: boolean;
}

// ── Meal Planner ──
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Petit-déj",
  lunch: "Déjeuner",
  dinner: "Dîner",
  snack: "Snack",
};

export const DAY_LABELS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
] as const;

export interface MealSlot {
  id: string;
  dayOfWeek: number; // 0=Lundi
  mealType: MealType;
  title: string;
  recipeId?: string;
}

// ── Fridge Alert ──
export interface FridgeItem {
  id: string;
  name: string;
  expiryDate: string; // ISO date
  quantity: string;
  consumed: boolean;
}

// ── Habit Tracker ──
export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  completions: number[]; // 0 = Monday … 6 = Sunday
}

// ── Brain Dump ──
export interface BrainNote {
  id: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Module navigation ──
export type TodoModule =
  | "dashboard"
  | "grocery"
  | "meals"
  | "fridge"
  | "habits"
  | "braindump";

export const MODULE_META: Record<TodoModule, { label: string; emoji: string }> =
  {
    dashboard: { label: "Aujourd'hui", emoji: "📋" },
    grocery: { label: "Courses", emoji: "🛒" },
    meals: { label: "Repas", emoji: "🍽️" },
    fridge: { label: "Frigo", emoji: "❄️" },
    habits: { label: "Habitudes", emoji: "✦" },
    braindump: { label: "Notes", emoji: "💭" },
  };
