import { create } from "zustand";
import type {
  Todo,
  Priority,
  GroceryItem,
  Aisle,
  MealSlot,
  MealType,
  FridgeItem,
  Habit,
  BrainNote,
  TodoModule,
} from "../types";

// ── Helpers ──
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString();

// ── Seed data ──
const SEED_TODOS: Todo[] = [
  {
    id: "t1",
    title: "Appeler le médecin",
    completed: false,
    priority: "high",
    dueDate: "2026-03-09",
    createdAt: "2026-03-07T08:00:00Z",
  },
  {
    id: "t2",
    title: "Répondre aux emails",
    completed: true,
    priority: "medium",
    createdAt: "2026-03-08T09:00:00Z",
  },
  {
    id: "t3",
    title: "Faire le ménage",
    completed: false,
    priority: "low",
    dueDate: "2026-03-10",
    createdAt: "2026-03-08T10:00:00Z",
  },
  {
    id: "t4",
    title: "Préparer la réunion lundi",
    completed: false,
    priority: "high",
    dueDate: "2026-03-10",
    createdAt: "2026-03-09T07:00:00Z",
  },
  {
    id: "t5",
    title: "Envoyer le devis freelance",
    completed: false,
    priority: "medium",
    dueDate: "2026-03-09",
    createdAt: "2026-03-09T08:00:00Z",
  },
];

const SEED_GROCERY: GroceryItem[] = [
  {
    id: "g1",
    name: "Tomates",
    quantity: 6,
    unit: "pcs",
    aisle: "Fruits & Légumes",
    checked: false,
  },
  {
    id: "g2",
    name: "Poulet",
    quantity: 500,
    unit: "g",
    price: 6.5,
    aisle: "Boucherie & Poissonnerie",
    checked: false,
  },
  {
    id: "g3",
    name: "Lait demi-écrémé",
    quantity: 2,
    unit: "L",
    price: 1.8,
    aisle: "Produits laitiers",
    checked: false,
  },
  {
    id: "g4",
    name: "Baguette tradition",
    quantity: 2,
    unit: "pcs",
    price: 1.3,
    aisle: "Boulangerie",
    checked: true,
  },
  {
    id: "g5",
    name: "Pâtes penne",
    quantity: 500,
    unit: "g",
    price: 1.2,
    aisle: "Épicerie",
    checked: false,
  },
  {
    id: "g6",
    name: "Eau gazeuse",
    quantity: 6,
    unit: "btl",
    price: 3.5,
    aisle: "Boissons",
    checked: false,
  },
  {
    id: "g7",
    name: "Dentifrice",
    quantity: 1,
    unit: "tube",
    price: 2.9,
    aisle: "Hygiène",
    checked: false,
  },
  {
    id: "g8",
    name: "Avocat",
    quantity: 3,
    unit: "pcs",
    price: 2.4,
    aisle: "Fruits & Légumes",
    checked: false,
  },
];

const SEED_MEALS: MealSlot[] = [
  { id: "m1", dayOfWeek: 0, mealType: "lunch", title: "Salade César" },
  {
    id: "m2",
    dayOfWeek: 0,
    mealType: "dinner",
    title: "Poulet rôti + légumes",
  },
  { id: "m3", dayOfWeek: 1, mealType: "lunch", title: "Pâtes carbonara" },
  { id: "m4", dayOfWeek: 1, mealType: "dinner", title: "Soupe de légumes" },
  { id: "m5", dayOfWeek: 2, mealType: "lunch", title: "Bowl saumon avocat" },
  { id: "m6", dayOfWeek: 3, mealType: "dinner", title: "Pizza maison" },
  { id: "m7", dayOfWeek: 4, mealType: "lunch", title: "Quiche lorraine" },
  { id: "m8", dayOfWeek: 5, mealType: "breakfast", title: "Pancakes" },
  { id: "m9", dayOfWeek: 5, mealType: "dinner", title: "Burger maison" },
  { id: "m10", dayOfWeek: 6, mealType: "lunch", title: "Brunch complet" },
];

const SEED_FRIDGE: FridgeItem[] = [
  {
    id: "f1",
    name: "Yaourts nature",
    expiryDate: "2026-03-10",
    quantity: "4 pots",
    consumed: false,
  },
  {
    id: "f2",
    name: "Jambon blanc",
    expiryDate: "2026-03-09",
    quantity: "3 tranches",
    consumed: false,
  },
  {
    id: "f3",
    name: "Crème fraîche",
    expiryDate: "2026-03-11",
    quantity: "1 pot",
    consumed: false,
  },
  {
    id: "f4",
    name: "Saumon fumé",
    expiryDate: "2026-03-09",
    quantity: "2 tranches",
    consumed: true,
  },
];

const SEED_HABITS: Habit[] = [
  {
    id: "h1",
    name: "Méditation",
    icon: "🧘",
    color: "#6c5ce7",
    completions: [0, 2, 4],
  },
  {
    id: "h2",
    name: "Sport",
    icon: "💪",
    color: "#00b894",
    completions: [1, 3, 5],
  },
  {
    id: "h3",
    name: "Lecture",
    icon: "📖",
    color: "#e17055",
    completions: [0, 1, 2, 3, 4, 5, 6],
  },
  {
    id: "h4",
    name: "Eau 2L",
    icon: "💧",
    color: "#0984e3",
    completions: [0, 1, 2, 3, 4],
  },
  {
    id: "h5",
    name: "Pas d'écran 22h",
    icon: "📵",
    color: "#fdcb6e",
    completions: [],
  },
];

const SEED_NOTES: BrainNote[] = [
  {
    id: "n1",
    content: "Idée : app de suivi de lectures avec notes par chapitre",
    color: "#fff",
    pinned: true,
    createdAt: "2026-03-08T14:00:00Z",
    updatedAt: "2026-03-08T14:00:00Z",
  },
  {
    id: "n2",
    content: "Ne pas oublier : anniversaire de Maman le 28 mars",
    color: "#fff",
    pinned: false,
    createdAt: "2026-03-09T08:30:00Z",
    updatedAt: "2026-03-09T08:30:00Z",
  },
  {
    id: "n3",
    content: "Recette à tester : risotto aux champignons de Julia",
    color: "#fff",
    pinned: false,
    createdAt: "2026-03-09T09:00:00Z",
    updatedAt: "2026-03-09T09:00:00Z",
  },
];

// ══════════════════════════════════════════════
// Store
// ══════════════════════════════════════════════

interface TodoState {
  activeModule: TodoModule;
  setActiveModule: (m: TodoModule) => void;

  // ── Todos ──
  todos: Todo[];
  addTodo: (title: string, priority?: Priority, dueDate?: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, data: Partial<Todo>) => void;

  // ── Grocery ──
  groceryItems: GroceryItem[];
  addGroceryItem: (
    name: string,
    aisle: Aisle,
    quantity?: number,
    unit?: string,
    price?: number,
  ) => void;
  toggleGroceryItem: (id: string) => void;
  removeGroceryItem: (id: string) => void;
  clearCheckedGrocery: () => void;

  // ── Meals ──
  mealSlots: MealSlot[];
  setMealSlot: (dayOfWeek: number, mealType: MealType, title: string) => void;
  removeMealSlot: (id: string) => void;

  // ── Fridge ──
  fridgeItems: FridgeItem[];
  addFridgeItem: (name: string, expiryDate: string, quantity?: string) => void;
  toggleFridgeConsumed: (id: string) => void;
  removeFridgeItem: (id: string) => void;

  // ── Habits ──
  habits: Habit[];
  addHabit: (name: string, icon?: string, color?: string) => void;
  removeHabit: (id: string) => void;
  toggleHabitDay: (id: string, day?: number) => void;

  // ── Brain dump ──
  brainNotes: BrainNote[];
  addBrainNote: (content: string) => void;
  updateBrainNote: (id: string, content: string) => void;
  removeBrainNote: (id: string) => void;
  togglePinNote: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  activeModule: "dashboard",
  setActiveModule: (m) => set({ activeModule: m }),

  // ── Todos ──
  todos: SEED_TODOS,
  addTodo: (title, priority = "medium", dueDate) =>
    set((s) => ({
      todos: [
        {
          id: uid(),
          title,
          completed: false,
          priority,
          dueDate,
          createdAt: now(),
        },
        ...s.todos,
      ],
    })),
  toggleTodo: (id) =>
    set((s) => ({
      todos: s.todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t,
      ),
    })),
  removeTodo: (id) =>
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
  updateTodo: (id, data) =>
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),

  // ── Grocery ──
  groceryItems: SEED_GROCERY,
  addGroceryItem: (name, aisle, quantity = 1, unit = "pcs", price) =>
    set((s) => ({
      groceryItems: [
        { id: uid(), name, quantity, unit, price, aisle, checked: false },
        ...s.groceryItems,
      ],
    })),
  toggleGroceryItem: (id) =>
    set((s) => ({
      groceryItems: s.groceryItems.map((g) =>
        g.id === id ? { ...g, checked: !g.checked } : g,
      ),
    })),
  removeGroceryItem: (id) =>
    set((s) => ({ groceryItems: s.groceryItems.filter((g) => g.id !== id) })),
  clearCheckedGrocery: () =>
    set((s) => ({ groceryItems: s.groceryItems.filter((g) => !g.checked) })),

  // ── Meals ──
  mealSlots: SEED_MEALS,
  setMealSlot: (dayOfWeek, mealType, title) =>
    set((s) => {
      const existing = s.mealSlots.find(
        (m) => m.dayOfWeek === dayOfWeek && m.mealType === mealType,
      );
      if (existing) {
        return {
          mealSlots: s.mealSlots.map((m) =>
            m.id === existing.id ? { ...m, title } : m,
          ),
        };
      }
      return {
        mealSlots: [...s.mealSlots, { id: uid(), dayOfWeek, mealType, title }],
      };
    }),
  removeMealSlot: (id) =>
    set((s) => ({ mealSlots: s.mealSlots.filter((m) => m.id !== id) })),

  // ── Fridge ──
  fridgeItems: SEED_FRIDGE,
  addFridgeItem: (name, expiryDate, quantity = "1") =>
    set((s) => ({
      fridgeItems: [
        { id: uid(), name, expiryDate, quantity, consumed: false },
        ...s.fridgeItems,
      ],
    })),
  toggleFridgeConsumed: (id) =>
    set((s) => ({
      fridgeItems: s.fridgeItems.map((f) =>
        f.id === id ? { ...f, consumed: !f.consumed } : f,
      ),
    })),
  removeFridgeItem: (id) =>
    set((s) => ({ fridgeItems: s.fridgeItems.filter((f) => f.id !== id) })),

  // ── Habits ──
  habits: SEED_HABITS,
  addHabit: (name, icon = "✦", color = "#6c5ce7") =>
    set((s) => ({
      habits: [...s.habits, { id: uid(), name, icon, color, completions: [] }],
    })),
  removeHabit: (id) =>
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),
  toggleHabitDay: (id, day) => {
    const d = day ?? (new Date().getDay() + 6) % 7; // JS Sunday=0 → 0=Mon
    set((s) => ({
      habits: s.habits.map((h) => {
        if (h.id !== id) return h;
        const has = h.completions.includes(d);
        return {
          ...h,
          completions: has
            ? h.completions.filter((c) => c !== d)
            : [...h.completions, d],
        };
      }),
    }));
  },

  // ── Brain dump ──
  brainNotes: SEED_NOTES,
  addBrainNote: (content) =>
    set((s) => ({
      brainNotes: [
        {
          id: uid(),
          content,
          color: "#fff",
          pinned: false,
          createdAt: now(),
          updatedAt: now(),
        },
        ...s.brainNotes,
      ],
    })),
  updateBrainNote: (id, content) =>
    set((s) => ({
      brainNotes: s.brainNotes.map((n) =>
        n.id === id ? { ...n, content, updatedAt: now() } : n,
      ),
    })),
  removeBrainNote: (id) =>
    set((s) => ({ brainNotes: s.brainNotes.filter((n) => n.id !== id) })),
  togglePinNote: (id) =>
    set((s) => ({
      brainNotes: s.brainNotes.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned } : n,
      ),
    })),
}));
