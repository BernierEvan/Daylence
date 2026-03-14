// ═══════════════════════════════════════════════
// Daylence Todos — Type Definitions
// ═══════════════════════════════════════════════

// ── Core Todo ──
export type Priority = "low" | "medium" | "high";

export type RecurrenceType =
  | "none"
  | "daily"
  | "weekdays"
  | "weekly"
  | "monthly";

export interface Recurrence {
  type: RecurrenceType;
  /** For weekly: which days (0=Mon … 6=Sun). For monthly: day of month. */
  daysOfWeek?: number[];
  endDate?: string; // ISO date
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string; // ISO date — always set (defaults to today)
  categoryId?: string; // FK to TodoCategory
  recurrence?: Recurrence;
  createdAt: string;
}

// ── Category ──
export interface TodoCategory {
  id: string;
  emoji: string;
  name: string;
  color: string; // hex
}

export const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  none: "Une seule fois",
  daily: "Tous les jours",
  weekdays: "Jours ouvrés",
  weekly: "Chaque semaine",
  monthly: "Chaque mois",
};

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

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  createdAt: string;
  updatedAt: string;
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
  color?: string;
  recipeId?: string;
}

// ── Fridge Alert ──
export interface FridgeItem {
  id: string;
  name: string;
  expiryDate: string; // ISO date
  quantity: string;
  color?: string;
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
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ── Color palette for user-customisable items ──
export const COLOR_PALETTE = [
  "#6c5ce7",
  "#0984e3",
  "#00b894",
  "#e17055",
  "#fdcb6e",
  "#fd79a8",
  "#d63031",
  "#00cec9",
  "#e84393",
  "#2d3436",
  "#0652DD",
  "#1abc9c",
] as const;

// ── Aisle colors (fixed mapping for grocery categories) ──
export const AISLE_COLORS: Record<Aisle, string> = {
  "Fruits & Légumes": "#00b894",
  "Boucherie & Poissonnerie": "#d63031",
  "Produits laitiers": "#74b9ff",
  Boulangerie: "#e17055",
  Épicerie: "#fdcb6e",
  Boissons: "#0984e3",
  Surgelés: "#81ecec",
  Hygiène: "#a29bfe",
  Autres: "#636e72",
};

// ── Module navigation ──
export type TodoModule =
  | "overview"
  | "dashboard"
  | "grocery"
  | "meals"
  | "fridge"
  | "habits"
  | "braindump";

export const MODULE_META: Record<TodoModule, { label: string; emoji: string }> =
  {
    overview: { label: "Aperçu", emoji: "📊" },
    dashboard: { label: "Agenda", emoji: "📋" },
    grocery: { label: "Courses", emoji: "🛒" },
    meals: { label: "Repas", emoji: "🍽️" },
    fridge: { label: "Frigo", emoji: "❄️" },
    habits: { label: "Habitudes", emoji: "✦" },
    braindump: { label: "Notes", emoji: "💭" },
  };
