import { supabase } from "../../../supabaseClient";
import type {
  Todo,
  TodoCategory,
  GroceryList,
  GroceryItem,
  MealSlot,
  MealType,
  FridgeItem,
  Habit,
  BrainNote,
} from "../types";

/** Await a Supabase query and log any error. */
async function exec<T>(
  query: PromiseLike<{ error: { message: string } | null; data: T }>,
  label: string,
) {
  const res = await query;
  if (res.error) console.error(`[DB ${label}]`, res.error.message);
  return res;
}

// ══════════════════════════════════════════════
// Profile
// ══════════════════════════════════════════════

export async function fetchProfileId(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id_profile")
    .eq("id_user", userId)
    .limit(1)
    .single();
  if (error) console.error("[DB fetchProfileId]", error.message);
  return data?.id_profile ?? null;
}

/** Ensure a profile row exists for the user, creating one if missing. */
export async function ensureProfile(userId: string): Promise<string | null> {
  const pid = await fetchProfileId(userId);
  if (pid) return pid;

  const newId = crypto.randomUUID();
  const { error } = await supabase
    .from("profiles")
    .insert({ id_profile: newId, id_user: userId, name: "Mon profil" });
  if (error) {
    console.error("[DB ensureProfile]", error.message);
    return null;
  }
  return newId;
}

// ══════════════════════════════════════════════
// Todos
// ══════════════════════════════════════════════

function rowToTodo(r: Record<string, unknown>): Todo {
  const rec =
    r.recurrence_type && r.recurrence_type !== "none"
      ? {
          type: r.recurrence_type as string,
          ...((r.recurrence_days_of_week as number[] | null)
            ? { daysOfWeek: r.recurrence_days_of_week as number[] }
            : {}),
          ...((r.recurrence_end_date as string | null)
            ? { endDate: r.recurrence_end_date as string }
            : {}),
        }
      : undefined;
  return {
    id: r.id_todo as string,
    title: r.title as string,
    completed: r.is_completed as boolean,
    priority: r.priority as Todo["priority"],
    dueDate: r.due_date as string,
    categoryId: (r.id_category as string) ?? undefined,
    ...(rec ? { recurrence: rec as Todo["recurrence"] } : {}),
    createdAt: r.created_at as string,
  };
}

export async function fetchTodos(profileId: string): Promise<Todo[]> {
  const { data } = await supabase
    .from("todos")
    .select("*")
    .eq("id_profile", profileId)
    .order("created_at", { ascending: false });
  return (data ?? []).map(rowToTodo);
}

export async function insertTodo(profileId: string, todo: Todo) {
  return exec(
    supabase.from("todos").insert({
      id_todo: todo.id,
      id_profile: profileId,
      title: todo.title,
      is_completed: todo.completed,
      priority: todo.priority,
      due_date: todo.dueDate,
      id_category: todo.categoryId ?? null,
      recurrence_type: todo.recurrence?.type ?? null,
      recurrence_days_of_week: todo.recurrence?.daysOfWeek ?? null,
      recurrence_end_date: todo.recurrence?.endDate ?? null,
    }),
    "insertTodo",
  );
}

export async function updateTodoRow(todoId: string, data: Partial<Todo>) {
  const row: Record<string, unknown> = {};
  if (data.title !== undefined) row.title = data.title;
  if (data.completed !== undefined) row.is_completed = data.completed;
  if (data.priority !== undefined) row.priority = data.priority;
  if (data.dueDate !== undefined) row.due_date = data.dueDate;
  if (data.categoryId !== undefined) row.id_category = data.categoryId || null;
  if (data.recurrence !== undefined) {
    row.recurrence_type = data.recurrence?.type ?? null;
    row.recurrence_days_of_week = data.recurrence?.daysOfWeek ?? null;
    row.recurrence_end_date = data.recurrence?.endDate ?? null;
  }
  return exec(
    supabase.from("todos").update(row).eq("id_todo", todoId),
    "updateTodo",
  );
}

export async function deleteTodo(todoId: string) {
  return exec(
    supabase.from("todos").delete().eq("id_todo", todoId),
    "deleteTodo",
  );
}

// ══════════════════════════════════════════════
// Categories
// ══════════════════════════════════════════════

export async function fetchCategories(
  profileId: string,
): Promise<TodoCategory[]> {
  const { data } = await supabase
    .from("todo_categories")
    .select("*")
    .eq("id_profile", profileId)
    .order("name");
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id_category as string,
    emoji: (r.emoji as string) ?? "📌",
    name: r.name as string,
    color: r.color as string,
  }));
}

export async function insertCategory(profileId: string, cat: TodoCategory) {
  return exec(
    supabase.from("todo_categories").insert({
      id_category: cat.id,
      id_profile: profileId,
      emoji: cat.emoji,
      name: cat.name,
      color: cat.color,
    }),
    "insertCategory",
  );
}

export async function updateCategory(
  catId: string,
  data: Partial<TodoCategory>,
) {
  const row: Record<string, unknown> = {};
  if (data.emoji !== undefined) row.emoji = data.emoji;
  if (data.name !== undefined) row.name = data.name;
  if (data.color !== undefined) row.color = data.color;
  return exec(
    supabase.from("todo_categories").update(row).eq("id_category", catId),
    "updateCategory",
  );
}

export async function deleteCategory(catId: string) {
  // Also clear id_category on todos referencing it
  await exec(
    supabase
      .from("todos")
      .update({ id_category: null })
      .eq("id_category", catId),
    "clearCategoryFromTodos",
  );
  return exec(
    supabase.from("todo_categories").delete().eq("id_category", catId),
    "deleteCategory",
  );
}

// ══════════════════════════════════════════════
// Grocery Lists + Items
// ══════════════════════════════════════════════

function rowToGroceryItem(r: Record<string, unknown>): GroceryItem {
  return {
    id: r.id_grocery as string,
    name: r.name as string,
    quantity: (r.quantity as number) ?? 1,
    unit: (r.unit as string) ?? "pcs",
    price: (r.price as number) ?? undefined,
    aisle: r.aisle as GroceryItem["aisle"],
    checked: r.is_checked as boolean,
  };
}

export async function fetchGroceryLists(
  profileId: string,
): Promise<GroceryList[]> {
  const { data: lists } = await supabase
    .from("grocery_lists")
    .select("*")
    .eq("id_profile", profileId)
    .order("created_at", { ascending: false });
  if (!lists?.length) return [];

  const listIds = lists.map((l) => l.id_grocery_list);
  const { data: items } = await supabase
    .from("groceries")
    .select("*")
    .in("id_grocery_list", listIds);

  const byList: Record<string, GroceryItem[]> = {};
  for (const r of items ?? []) {
    const lid = r.id_grocery_list as string;
    (byList[lid] ??= []).push(rowToGroceryItem(r));
  }

  return lists.map((l) => ({
    id: l.id_grocery_list as string,
    name: l.name as string,
    createdAt: l.created_at as string,
    updatedAt: l.updated_at as string,
    items: byList[l.id_grocery_list as string] ?? [],
  }));
}

export async function insertGroceryList(
  profileId: string,
  id: string,
  name: string,
) {
  return exec(
    supabase.from("grocery_lists").insert({
      id_grocery_list: id,
      id_profile: profileId,
      name,
    }),
    "insertGroceryList",
  );
}

export async function deleteGroceryList(listId: string) {
  return exec(
    supabase.from("grocery_lists").delete().eq("id_grocery_list", listId),
    "deleteGroceryList",
  );
}

export async function renameGroceryListRow(listId: string, name: string) {
  return exec(
    supabase
      .from("grocery_lists")
      .update({ name, updated_at: new Date().toISOString() })
      .eq("id_grocery_list", listId),
    "renameGroceryList",
  );
}

export async function insertGroceryItem(
  profileId: string,
  listId: string,
  item: GroceryItem,
) {
  return exec(
    supabase.from("groceries").insert({
      id_grocery: item.id,
      id_profile: profileId,
      id_grocery_list: listId,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: item.price ?? null,
      aisle: item.aisle,
      is_checked: false,
    }),
    "insertGroceryItem",
  );
}

export async function toggleGroceryItemRow(itemId: string, checked: boolean) {
  return exec(
    supabase
      .from("groceries")
      .update({ is_checked: checked })
      .eq("id_grocery", itemId),
    "toggleGroceryItem",
  );
}

export async function deleteGroceryItem(itemId: string) {
  return exec(
    supabase.from("groceries").delete().eq("id_grocery", itemId),
    "deleteGroceryItem",
  );
}

export async function deleteCheckedGroceryItems(listId: string) {
  return exec(
    supabase
      .from("groceries")
      .delete()
      .eq("id_grocery_list", listId)
      .eq("is_checked", true),
    "deleteCheckedGroceryItems",
  );
}

// ══════════════════════════════════════════════
// Meal Slots
// ══════════════════════════════════════════════

function rowToMealSlot(r: Record<string, unknown>): MealSlot {
  return {
    id: r.id_meal_slot as string,
    dayOfWeek: r.day_of_week as number,
    mealType: r.id_meal_time as MealType,
    title: r.title as string,
    ...((r.color as string | null) ? { color: r.color as string } : {}),
    ...((r.recipe_id as string | null)
      ? { recipeId: r.recipe_id as string }
      : {}),
  };
}

export async function fetchMealSlots(profileId: string): Promise<MealSlot[]> {
  const { data } = await supabase
    .from("meal_slots")
    .select("*")
    .eq("id_profile", profileId);
  return (data ?? []).map(rowToMealSlot);
}

export async function insertMealSlot(profileId: string, slot: MealSlot) {
  return exec(
    supabase.from("meal_slots").insert({
      id_meal_slot: slot.id,
      id_profile: profileId,
      day_of_week: slot.dayOfWeek,
      id_meal_time: slot.mealType,
      title: slot.title,
      color: slot.color ?? null,
      recipe_id: slot.recipeId ?? null,
    }),
    "insertMealSlot",
  );
}

export async function updateMealSlotTitle(slotId: string, title: string) {
  return exec(
    supabase.from("meal_slots").update({ title }).eq("id_meal_slot", slotId),
    "updateMealSlotTitle",
  );
}

export async function deleteMealSlot(slotId: string) {
  return exec(
    supabase.from("meal_slots").delete().eq("id_meal_slot", slotId),
    "deleteMealSlot",
  );
}

export async function updateMealSlotColor(slotId: string, color: string) {
  return exec(
    supabase.from("meal_slots").update({ color }).eq("id_meal_slot", slotId),
    "updateMealSlotColor",
  );
}

export async function deleteAllMealSlots(profileId: string) {
  return exec(
    supabase.from("meal_slots").delete().eq("id_profile", profileId),
    "deleteAllMealSlots",
  );
}

// ══════════════════════════════════════════════
// Fridge
// ══════════════════════════════════════════════

function rowToFridgeItem(r: Record<string, unknown>): FridgeItem {
  return {
    id: r.id_fridge as string,
    name: r.name as string,
    expiryDate: r.expiry_date as string,
    quantity: (r.quantity as string) ?? "1",
    ...((r.color as string | null) ? { color: r.color as string } : {}),
    consumed: r.is_consumed as boolean,
  };
}

export async function fetchFridgeItems(
  profileId: string,
): Promise<FridgeItem[]> {
  const { data } = await supabase
    .from("fridge_items")
    .select("*")
    .eq("id_profile", profileId);
  return (data ?? []).map(rowToFridgeItem);
}

export async function insertFridgeItem(profileId: string, item: FridgeItem) {
  return exec(
    supabase.from("fridge_items").insert({
      id_fridge: item.id,
      id_profile: profileId,
      name: item.name,
      expiry_date: item.expiryDate,
      quantity: item.quantity,
      is_consumed: false,
      color: item.color ?? null,
    }),
    "insertFridgeItem",
  );
}

export async function toggleFridgeConsumedRow(
  itemId: string,
  consumed: boolean,
) {
  return exec(
    supabase
      .from("fridge_items")
      .update({ is_consumed: consumed })
      .eq("id_fridge", itemId),
    "toggleFridgeConsumed",
  );
}

export async function deleteFridgeItemRow(itemId: string) {
  return exec(
    supabase.from("fridge_items").delete().eq("id_fridge", itemId),
    "deleteFridgeItem",
  );
}

export async function updateFridgeColorRow(itemId: string, color: string) {
  return exec(
    supabase.from("fridge_items").update({ color }).eq("id_fridge", itemId),
    "updateFridgeColor",
  );
}

// ══════════════════════════════════════════════
// Habits + completions
// ══════════════════════════════════════════════

/** Format a Date as local YYYY-MM-DD */
function localISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Monday of the current week (ISO date) */
function getCurrentWeekMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return localISO(d);
}

function getCurrentWeekSunday(): string {
  const m = new Date(getCurrentWeekMonday() + "T00:00:00");
  m.setDate(m.getDate() + 6);
  return localISO(m);
}

/** Convert a 0-based day index (0=Mon...6=Sun) to the actual date in the current week */
function dayIndexToDate(dayIdx: number): string {
  const m = new Date(getCurrentWeekMonday() + "T00:00:00");
  m.setDate(m.getDate() + dayIdx);
  return localISO(m);
}

export async function fetchHabits(profileId: string): Promise<Habit[]> {
  const { data: rows } = await supabase
    .from("habits")
    .select("*")
    .eq("id_profile", profileId);
  if (!rows?.length) return [];

  const monday = getCurrentWeekMonday();
  const sunday = getCurrentWeekSunday();
  const ids = rows.map((h) => h.id_habit);

  const { data: compRows } = await supabase
    .from("habit_completions")
    .select("*")
    .in("id_habit", ids)
    .gte("completion_date", monday)
    .lte("completion_date", sunday);

  const byHabit: Record<string, number[]> = {};
  for (const c of compRows ?? []) {
    const dt = new Date((c.completion_date as string) + "T00:00:00");
    const idx = (dt.getDay() + 6) % 7;
    (byHabit[c.id_habit as string] ??= []).push(idx);
  }

  return rows.map((r) => ({
    id: r.id_habit as string,
    name: r.name as string,
    icon: (r.icon as string) ?? "✦",
    color: (r.color as string) ?? "#6c5ce7",
    completions: byHabit[r.id_habit as string] ?? [],
  }));
}

export async function insertHabit(profileId: string, habit: Habit) {
  return exec(
    supabase.from("habits").insert({
      id_habit: habit.id,
      id_profile: profileId,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
    }),
    "insertHabit",
  );
}

export async function deleteHabitRow(habitId: string) {
  return exec(
    supabase.from("habits").delete().eq("id_habit", habitId),
    "deleteHabit",
  );
}

export async function updateHabitColorRow(habitId: string, color: string) {
  return exec(
    supabase.from("habits").update({ color }).eq("id_habit", habitId),
    "updateHabitColor",
  );
}

export async function addHabitCompletion(habitId: string, dayIdx: number) {
  return exec(
    supabase.from("habit_completions").insert({
      id_habit_completion: crypto.randomUUID(),
      id_habit: habitId,
      completion_date: dayIndexToDate(dayIdx),
    }),
    "addHabitCompletion",
  );
}

export async function removeHabitCompletion(habitId: string, dayIdx: number) {
  return exec(
    supabase
      .from("habit_completions")
      .delete()
      .eq("id_habit", habitId)
      .eq("completion_date", dayIndexToDate(dayIdx)),
    "removeHabitCompletion",
  );
}

// ══════════════════════════════════════════════
// Brain Dump Notes
// ══════════════════════════════════════════════

function rowToNote(r: Record<string, unknown>): BrainNote {
  return {
    id: r.id_note as string,
    title: (r.title as string) ?? "",
    content: (r.content as string) ?? "",
    color: (r.color as string) ?? "#fff",
    pinned: (r.is_pinned as boolean) ?? false,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export async function fetchNotes(profileId: string): Promise<BrainNote[]> {
  const { data } = await supabase
    .from("notes")
    .select("*")
    .eq("id_profile", profileId)
    .order("created_at", { ascending: false });
  return (data ?? []).map(rowToNote);
}

export async function insertNote(profileId: string, note: BrainNote) {
  return exec(
    supabase.from("notes").insert({
      id_note: note.id,
      id_profile: profileId,
      title: note.title,
      content: note.content,
      color: note.color,
      is_pinned: note.pinned,
    }),
    "insertNote",
  );
}

export async function updateNoteRow(
  noteId: string,
  data: Partial<{
    title: string;
    content: string;
    color: string;
    pinned: boolean;
  }>,
) {
  const row: Record<string, unknown> = {};
  if (data.title !== undefined) row.title = data.title;
  if (data.content !== undefined) row.content = data.content;
  if (data.color !== undefined) row.color = data.color;
  if (data.pinned !== undefined) row.is_pinned = data.pinned;
  row.updated_at = new Date().toISOString();
  return exec(
    supabase.from("notes").update(row).eq("id_note", noteId),
    "updateNote",
  );
}

export async function deleteNote(noteId: string) {
  return exec(
    supabase.from("notes").delete().eq("id_note", noteId),
    "deleteNote",
  );
}
