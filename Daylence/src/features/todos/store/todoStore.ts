import { create } from "zustand";
import type {
  Todo,
  Priority,
  Recurrence,
  TodoCategory,
  GroceryList as GroceryListType,
  GroceryItem,
  Aisle,
  MealSlot,
  MealType,
  FridgeItem,
  Habit,
  BrainNote,
  TodoModule,
} from "../types";
import * as db from "../services/todoService";

// ── Helpers ──
const uid = () => crypto.randomUUID();
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const now = () => new Date().toISOString();

// ══════════════════════════════════════════════
// Store
// ══════════════════════════════════════════════

interface TodoState {
  // ── Init ──
  profileId: string | null;
  loading: boolean;
  init: (userId: string) => Promise<void>;

  activeModule: TodoModule;
  setActiveModule: (m: TodoModule) => void;

  // ── Agenda ──
  selectedDate: string; // ISO date
  setSelectedDate: (d: string) => void;

  // ── Categories ──
  categories: TodoCategory[];
  addCategory: (emoji: string, name: string, color: string) => void;
  updateCategory: (id: string, data: Partial<Omit<TodoCategory, "id">>) => void;
  removeCategory: (id: string) => void;

  // ── Todos ──
  todos: Todo[];
  addTodo: (
    title: string,
    priority?: Priority,
    dueDate?: string,
    recurrence?: Recurrence,
    categoryId?: string,
  ) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, data: Partial<Todo>) => void;

  // ── Grocery Lists ──
  groceryLists: GroceryListType[];
  activeGroceryListId: string | null;
  setActiveGroceryListId: (id: string | null) => void;
  addGroceryList: (name: string) => void;
  removeGroceryList: (id: string) => void;
  renameGroceryList: (id: string, name: string) => void;
  addGroceryItem: (
    listId: string,
    name: string,
    aisle: Aisle,
    quantity?: number,
    unit?: string,
    price?: number,
  ) => void;
  toggleGroceryItem: (listId: string, itemId: string) => void;
  removeGroceryItem: (listId: string, itemId: string) => void;
  clearCheckedGrocery: (listId: string) => void;

  // ── Meals ──
  mealSlots: MealSlot[];
  setMealSlot: (dayOfWeek: number, mealType: MealType, title: string) => void;
  removeMealSlot: (id: string) => void;
  updateMealColor: (id: string, color: string) => void;
  clearAllMeals: () => void;

  // ── Fridge ──
  fridgeItems: FridgeItem[];
  addFridgeItem: (name: string, expiryDate: string, quantity?: string) => void;
  toggleFridgeConsumed: (id: string) => void;
  removeFridgeItem: (id: string) => void;
  updateFridgeColor: (id: string, color: string) => void;

  // ── Habits ──
  habits: Habit[];
  addHabit: (name: string, icon?: string, color?: string) => void;
  removeHabit: (id: string) => void;
  toggleHabitDay: (id: string, day?: number) => void;
  updateHabitColor: (id: string, color: string) => void;

  // ── Brain dump ──
  brainNotes: BrainNote[];
  addBrainNote: (title: string, content: string) => void;
  updateBrainNote: (
    id: string,
    data: Partial<{ title: string; content: string }>,
  ) => void;
  updateNoteColor: (id: string, color: string) => void;
  removeBrainNote: (id: string) => void;
  togglePinNote: (id: string) => void;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  // ── Init ──
  profileId: null,
  loading: true,

  init: async (userId: string) => {
    if (get().profileId) return;
    set({ loading: true });
    const profileId = await db.ensureProfile(userId);
    if (!profileId) {
      console.warn(
        "[todoStore] Impossible de résoudre/créer un profil pour userId:",
        userId,
      );
      set({ loading: false });
      return;
    }
    console.log("[todoStore] profileId résolu:", profileId);
    const [
      todos,
      groceryLists,
      mealSlots,
      fridgeItems,
      habits,
      brainNotes,
      categories,
    ] = await Promise.all([
      db.fetchTodos(profileId),
      db.fetchGroceryLists(profileId),
      db.fetchMealSlots(profileId),
      db.fetchFridgeItems(profileId),
      db.fetchHabits(profileId),
      db.fetchNotes(profileId),
      db.fetchCategories(profileId),
    ]);
    set({
      profileId,
      todos,
      groceryLists,
      mealSlots,
      fridgeItems,
      habits,
      brainNotes,
      categories,
      loading: false,
    });
  },

  activeModule: "overview",
  setActiveModule: (m) => set({ activeModule: m }),

  // ── Agenda ──
  selectedDate: today(),
  setSelectedDate: (d) => set({ selectedDate: d }),

  // ── Categories ──
  categories: [],
  addCategory: (emoji, name, color) => {
    const cat: TodoCategory = { id: uid(), emoji, name, color };
    set((s) => ({ categories: [...s.categories, cat] }));
    const pid = get().profileId;
    if (pid) db.insertCategory(pid, cat);
  },
  updateCategory: (id, data) => {
    set((s) => ({
      categories: s.categories.map((c) =>
        c.id === id ? { ...c, ...data } : c,
      ),
    }));
    db.updateCategory(id, data);
  },
  removeCategory: (id) => {
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      todos: s.todos.map((t) =>
        t.categoryId === id ? { ...t, categoryId: undefined } : t,
      ),
    }));
    db.deleteCategory(id);
  },

  // ── Todos ──
  todos: [],
  addTodo: (title, priority = "medium", dueDate, recurrence, categoryId) => {
    const todo: Todo = {
      id: uid(),
      title,
      completed: false,
      priority,
      dueDate: dueDate ?? today(),
      categoryId,
      recurrence: recurrence?.type === "none" ? undefined : recurrence,
      createdAt: now(),
    };
    set((s) => ({ todos: [todo, ...s.todos] }));
    const pid = get().profileId;
    if (pid) db.insertTodo(pid, todo);
  },
  toggleTodo: (id) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    const completed = !todo.completed;
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, completed } : t)),
    }));
    db.updateTodoRow(id, { completed });
  },
  removeTodo: (id) => {
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
    db.deleteTodo(id);
  },
  updateTodo: (id, data) => {
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
    db.updateTodoRow(id, data);
  },

  // ── Grocery Lists ──
  groceryLists: [],
  activeGroceryListId: null,
  setActiveGroceryListId: (id) => set({ activeGroceryListId: id }),
  addGroceryList: (name) => {
    const id = uid();
    set((s) => ({
      groceryLists: [
        { id, name, items: [], createdAt: now(), updatedAt: now() },
        ...s.groceryLists,
      ],
    }));
    const pid = get().profileId;
    if (pid) db.insertGroceryList(pid, id, name);
  },
  removeGroceryList: (id) => {
    set((s) => ({
      groceryLists: s.groceryLists.filter((l) => l.id !== id),
      activeGroceryListId:
        s.activeGroceryListId === id ? null : s.activeGroceryListId,
    }));
    db.deleteGroceryList(id);
  },
  renameGroceryList: (id, name) => {
    set((s) => ({
      groceryLists: s.groceryLists.map((l) =>
        l.id === id ? { ...l, name, updatedAt: now() } : l,
      ),
    }));
    db.renameGroceryListRow(id, name);
  },
  addGroceryItem: (listId, name, aisle, quantity = 1, unit = "pcs", price) => {
    const item: GroceryItem = {
      id: uid(),
      name,
      quantity,
      unit,
      price,
      aisle,
      checked: false,
    };
    set((s) => ({
      groceryLists: s.groceryLists.map((l) =>
        l.id === listId
          ? { ...l, updatedAt: now(), items: [item, ...l.items] }
          : l,
      ),
    }));
    const pid = get().profileId;
    if (pid) db.insertGroceryItem(pid, listId, item);
  },
  toggleGroceryItem: (listId, itemId) => {
    const list = get().groceryLists.find((l) => l.id === listId);
    const item = list?.items.find((i) => i.id === itemId);
    if (!item) return;
    const checked = !item.checked;
    set((s) => ({
      groceryLists: s.groceryLists.map((l) =>
        l.id === listId
          ? {
              ...l,
              updatedAt: now(),
              items: l.items.map((i) =>
                i.id === itemId ? { ...i, checked } : i,
              ),
            }
          : l,
      ),
    }));
    db.toggleGroceryItemRow(itemId, checked);
  },
  removeGroceryItem: (listId, itemId) => {
    set((s) => ({
      groceryLists: s.groceryLists.map((l) =>
        l.id === listId
          ? {
              ...l,
              updatedAt: now(),
              items: l.items.filter((i) => i.id !== itemId),
            }
          : l,
      ),
    }));
    db.deleteGroceryItem(itemId);
  },
  clearCheckedGrocery: (listId) => {
    set((s) => ({
      groceryLists: s.groceryLists.map((l) =>
        l.id === listId
          ? { ...l, updatedAt: now(), items: l.items.filter((i) => !i.checked) }
          : l,
      ),
    }));
    db.deleteCheckedGroceryItems(listId);
  },

  // ── Meals ──
  mealSlots: [],
  setMealSlot: (dayOfWeek, mealType, title) => {
    const existing = get().mealSlots.find(
      (m) => m.dayOfWeek === dayOfWeek && m.mealType === mealType,
    );
    if (existing) {
      set((s) => ({
        mealSlots: s.mealSlots.map((m) =>
          m.id === existing.id ? { ...m, title } : m,
        ),
      }));
      db.updateMealSlotTitle(existing.id, title);
    } else {
      const slot: MealSlot = { id: uid(), dayOfWeek, mealType, title };
      set((s) => ({ mealSlots: [...s.mealSlots, slot] }));
      const pid = get().profileId;
      if (pid) db.insertMealSlot(pid, slot);
    }
  },
  removeMealSlot: (id) => {
    set((s) => ({ mealSlots: s.mealSlots.filter((m) => m.id !== id) }));
    db.deleteMealSlot(id);
  },
  updateMealColor: (id, color) => {
    set((s) => ({
      mealSlots: s.mealSlots.map((m) => (m.id === id ? { ...m, color } : m)),
    }));
    db.updateMealSlotColor(id, color);
  },
  clearAllMeals: () => {
    set({ mealSlots: [] });
    const pid = get().profileId;
    if (pid) db.deleteAllMealSlots(pid);
  },

  // ── Fridge ──
  fridgeItems: [],
  addFridgeItem: (name, expiryDate, quantity = "1") => {
    const item: FridgeItem = {
      id: uid(),
      name,
      expiryDate,
      quantity,
      consumed: false,
    };
    set((s) => ({ fridgeItems: [item, ...s.fridgeItems] }));
    const pid = get().profileId;
    if (pid) db.insertFridgeItem(pid, item);
  },
  toggleFridgeConsumed: (id) => {
    const item = get().fridgeItems.find((f) => f.id === id);
    if (!item) return;
    const consumed = !item.consumed;
    set((s) => ({
      fridgeItems: s.fridgeItems.map((f) =>
        f.id === id ? { ...f, consumed } : f,
      ),
    }));
    db.toggleFridgeConsumedRow(id, consumed);
  },
  removeFridgeItem: (id) => {
    set((s) => ({ fridgeItems: s.fridgeItems.filter((f) => f.id !== id) }));
    db.deleteFridgeItemRow(id);
  },
  updateFridgeColor: (id, color) => {
    set((s) => ({
      fridgeItems: s.fridgeItems.map((f) =>
        f.id === id ? { ...f, color } : f,
      ),
    }));
    db.updateFridgeColorRow(id, color);
  },

  // ── Habits ──
  habits: [],
  addHabit: (name, icon = "✦", color = "#6c5ce7") => {
    const habit: Habit = { id: uid(), name, icon, color, completions: [] };
    set((s) => ({ habits: [...s.habits, habit] }));
    const pid = get().profileId;
    if (pid) db.insertHabit(pid, habit);
  },
  removeHabit: (id) => {
    set((s) => ({ habits: s.habits.filter((h) => h.id !== id) }));
    db.deleteHabitRow(id);
  },
  toggleHabitDay: (id, day) => {
    const d = day ?? (new Date().getDay() + 6) % 7;
    const habit = get().habits.find((h) => h.id === id);
    if (!habit) return;
    const has = habit.completions.includes(d);
    set((s) => ({
      habits: s.habits.map((h) => {
        if (h.id !== id) return h;
        return {
          ...h,
          completions: has
            ? h.completions.filter((c) => c !== d)
            : [...h.completions, d],
        };
      }),
    }));
    if (has) {
      db.removeHabitCompletion(id, d);
    } else {
      db.addHabitCompletion(id, d);
    }
  },
  updateHabitColor: (id, color) => {
    set((s) => ({
      habits: s.habits.map((h) => (h.id === id ? { ...h, color } : h)),
    }));
    db.updateHabitColorRow(id, color);
  },

  // ── Brain dump ──
  brainNotes: [],
  addBrainNote: (title, content) => {
    const note: BrainNote = {
      id: uid(),
      title,
      content,
      color: "#fff",
      pinned: false,
      createdAt: now(),
      updatedAt: now(),
    };
    set((s) => ({ brainNotes: [note, ...s.brainNotes] }));
    const pid = get().profileId;
    if (pid) db.insertNote(pid, note);
  },
  updateBrainNote: (id, data) => {
    set((s) => ({
      brainNotes: s.brainNotes.map((n) =>
        n.id === id ? { ...n, ...data, updatedAt: now() } : n,
      ),
    }));
    db.updateNoteRow(id, data);
  },
  updateNoteColor: (id, color) => {
    set((s) => ({
      brainNotes: s.brainNotes.map((n) =>
        n.id === id ? { ...n, color, updatedAt: now() } : n,
      ),
    }));
    db.updateNoteRow(id, { color });
  },
  removeBrainNote: (id) => {
    set((s) => ({ brainNotes: s.brainNotes.filter((n) => n.id !== id) }));
    db.deleteNote(id);
  },
  togglePinNote: (id) => {
    const note = get().brainNotes.find((n) => n.id === id);
    if (!note) return;
    const pinned = !note.pinned;
    set((s) => ({
      brainNotes: s.brainNotes.map((n) => (n.id === id ? { ...n, pinned } : n)),
    }));
    db.updateNoteRow(id, { pinned });
  },
}));
