import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Check,
  Flag,
  Repeat,
  ShoppingCart,
  AlertTriangle,
  Pin,
  Plus,
} from "lucide-react";
import { useTodoStore } from "../../todos/store/todoStore";
import { useWidgetStore } from "../store/widgetStore";
import type { Todo } from "../../todos/types";
import { MEAL_LABELS, type MealType, DAY_LABELS } from "../../todos/types";

/* ── helpers ── */

const isoToday = () => new Date().toISOString().slice(0, 10);

function matchesDate(todo: Todo, iso: string): boolean {
  if (todo.dueDate === iso) return true;
  if (!todo.recurrence) return false;
  const base = new Date(todo.dueDate + "T00:00:00");
  const target = new Date(iso + "T00:00:00");
  if (target < base) return false;
  if (todo.recurrence.endDate && iso > todo.recurrence.endDate) return false;
  const dow = (target.getDay() + 6) % 7;
  switch (todo.recurrence.type) {
    case "daily":
      return true;
    case "weekdays":
      return dow < 5;
    case "weekly":
      return (todo.recurrence.daysOfWeek ?? [(base.getDay() + 6) % 7]).includes(
        dow,
      );
    case "monthly":
      return target.getDate() === base.getDate();
    default:
      return false;
  }
}

const PRIORITY_COLOR: Record<string, string> = {
  high: "#e74c3c",
  medium: "#f39c12",
  low: "#95a5a6",
};

/** Navigate to /todos and activate the right module tab. */
function useGoToSection() {
  const navigate = useNavigate();
  const setActiveModule = useTodoStore((s) => s.setActiveModule);
  return (
    module:
      | "dashboard"
      | "grocery"
      | "meals"
      | "fridge"
      | "habits"
      | "braindump",
  ) => {
    setActiveModule(module);
    navigate("/todos");
  };
}

/* ═══════════════════════════════════════
   1. Agenda du jour
   ═══════════════════════════════════════ */
export function AgendaWidget({ widgetId }: { widgetId: string }) {
  const goTo = useGoToSection();
  const todos = useTodoStore((s) => s.todos);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeWidget = useWidgetStore((s) => s.removeWidget);

  const today = isoToday();
  const todayTodos = todos.filter((t) => !t.completed && matchesDate(t, today));
  const completedCount = todos.filter(
    (t) => t.completed && matchesDate(t, today),
  ).length;

  return (
    <div className="lp-w wt wt--agenda">
      <div className="wt__header">
        <h3 className="lp-w__title" onClick={() => goTo("dashboard")}>
          📋 Agenda du jour
        </h3>
        <button className="tw__remove" onClick={() => removeWidget(widgetId)}>
          <Trash2 size={15} />
        </button>
      </div>
      <div className="wt__summary">
        <span className="wt__badge wt__badge--accent">
          {todayTodos.length} à faire
        </span>
        <span className="wt__badge wt__badge--green">
          {completedCount} terminée{completedCount !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="wt__list">
        {todayTodos.slice(0, 5).map((t) => (
          <div key={t.id} className="wt__todo-row">
            <button className="wt__check" onClick={() => toggleTodo(t.id)}>
              <span className="wt__circle" />
            </button>
            <span className="wt__todo-title">{t.title}</span>
            {t.recurrence && <Repeat size={11} className="wt__recur" />}
            <Flag size={11} style={{ color: PRIORITY_COLOR[t.priority] }} />
          </div>
        ))}
        {todayTodos.length === 0 && (
          <p className="wt__empty-line">Rien de prévu aujourd'hui !</p>
        )}
      </div>
      {todayTodos.length > 5 && (
        <span className="wt__more" onClick={() => goTo("dashboard")}>
          +{todayTodos.length - 5} autres →
        </span>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   2. Courses
   ═══════════════════════════════════════ */
export function GroceryWidget({ widgetId }: { widgetId: string }) {
  const goTo = useGoToSection();
  const lists = useTodoStore((s) => s.groceryLists);
  const toggleGroceryItem = useTodoStore((s) => s.toggleGroceryItem);
  const addGroceryItem = useTodoStore((s) => s.addGroceryItem);
  const removeWidget = useWidgetStore((s) => s.removeWidget);

  const [openListId, setOpenListId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const totalItems = lists.reduce((s, l) => s + l.items.length, 0);
  const totalUnchecked = lists.reduce(
    (s, l) => s + l.items.filter((i) => !i.checked).length,
    0,
  );

  const openList = lists.find((l) => l.id === openListId);

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault();
    if (!openListId || !draft.trim()) return;
    addGroceryItem(openListId, draft.trim(), "Épicerie");
    setDraft("");
  };

  return (
    <div className="lp-w wt wt--grocery">
      <div className="wt__header">
        <h3 className="lp-w__title" onClick={() => goTo("grocery")}>
          🛒 Courses
        </h3>
        <button className="tw__remove" onClick={() => removeWidget(widgetId)}>
          <Trash2 size={15} />
        </button>
      </div>

      {!openList ? (
        /* ── overview: all lists ── */
        <>
          <div className="wt__summary">
            <span className="wt__badge wt__badge--accent">
              {lists.length} liste{lists.length !== 1 ? "s" : ""}
            </span>
            <span className="wt__badge wt__badge--muted">
              {totalUnchecked}/{totalItems} restant
              {totalUnchecked !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="wt__list">
            {lists.slice(0, 4).map((l) => {
              const checked = l.items.filter((i) => i.checked).length;
              const total = l.items.length;
              const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
              return (
                <div
                  key={l.id}
                  className="wt__grocery-row wt__grocery-row--clickable"
                  onClick={() => setOpenListId(l.id)}
                >
                  <ShoppingCart size={14} className="wt__grocery-icon" />
                  <span className="wt__grocery-name">{l.name}</span>
                  <div className="wt__mini-bar">
                    <div
                      className="wt__mini-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="wt__grocery-pct">{pct}%</span>
                </div>
              );
            })}
            {lists.length === 0 && (
              <p className="wt__empty-line">Aucune liste de courses</p>
            )}
          </div>
        </>
      ) : (
        /* ── detail: items inside a list ── */
        <>
          <button
            className="wt__back"
            onClick={() => {
              setOpenListId(null);
              setDraft("");
            }}
          >
            ← {openList.name}
          </button>

          <form className="wt__add-form" onSubmit={handleAddItem}>
            <input
              className="wt__add-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ajouter un article…"
            />
            <button className="wt__add-btn" type="submit">
              <Plus size={14} />
            </button>
          </form>

          <div className="wt__list">
            {openList.items.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className={`wt__grocery-item ${item.checked ? "wt__grocery-item--checked" : ""}`}
              >
                <button
                  className="wt__item-check"
                  onClick={() => toggleGroceryItem(openList.id, item.id)}
                >
                  {item.checked ? (
                    <Check size={12} strokeWidth={3} />
                  ) : (
                    <span className="wt__item-circle" />
                  )}
                </button>
                <span className="wt__item-name">{item.name}</span>
                <span className="wt__item-aisle">{item.aisle}</span>
              </div>
            ))}
            {openList.items.length === 0 && (
              <p className="wt__empty-line">Liste vide</p>
            )}
          </div>
          {openList.items.length > 8 && (
            <span className="wt__more" onClick={() => goTo("grocery")}>
              +{openList.items.length - 8} autres →
            </span>
          )}
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   3. Repas du jour
   ═══════════════════════════════════════ */
export function MealsWidget({ widgetId }: { widgetId: string }) {
  const goTo = useGoToSection();
  const mealSlots = useTodoStore((s) => s.mealSlots);
  const removeWidget = useWidgetStore((s) => s.removeWidget);

  const todayIdx = (new Date().getDay() + 6) % 7; // 0=Mon
  const todayMeals = mealSlots.filter((m) => m.dayOfWeek === todayIdx);
  const dayLabel = DAY_LABELS[todayIdx];

  const mealOrder: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  return (
    <div className="lp-w wt wt--meals">
      <div className="wt__header">
        <h3 className="lp-w__title" onClick={() => goTo("meals")}>
          🍽️ Repas — {dayLabel}
        </h3>
        <button className="tw__remove" onClick={() => removeWidget(widgetId)}>
          <Trash2 size={15} />
        </button>
      </div>
      <div className="wt__list">
        {mealOrder.map((mt) => {
          const meal = todayMeals.find((m) => m.mealType === mt);
          return (
            <div key={mt} className="wt__meal-row">
              <span className="wt__meal-type">{MEAL_LABELS[mt]}</span>
              <span
                className={`wt__meal-title ${!meal ? "wt__meal-title--empty" : ""}`}
              >
                {meal ? meal.title : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   4. Alertes frigo
   ═══════════════════════════════════════ */
export function FridgeWidget({ widgetId }: { widgetId: string }) {
  const goTo = useGoToSection();
  const fridgeItems = useTodoStore((s) => s.fridgeItems);
  const removeWidget = useWidgetStore((s) => s.removeWidget);

  const expiring = fridgeItems.filter((f) => {
    if (f.consumed) return false;
    const diff =
      (new Date(f.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  });

  const expired = expiring.filter(
    (f) => new Date(f.expiryDate).getTime() < Date.now(),
  );
  const soon = expiring.filter(
    (f) => new Date(f.expiryDate).getTime() >= Date.now(),
  );

  return (
    <div className="lp-w wt wt--fridge">
      <div className="wt__header">
        <h3 className="lp-w__title" onClick={() => goTo("fridge")}>
          ❄️ Alertes frigo
        </h3>
        <button className="tw__remove" onClick={() => removeWidget(widgetId)}>
          <Trash2 size={15} />
        </button>
      </div>
      {expiring.length === 0 ? (
        <p className="wt__empty-line">Tout est frais !</p>
      ) : (
        <>
          <div className="wt__summary">
            {expired.length > 0 && (
              <span className="wt__badge wt__badge--red">
                {expired.length} périmé{expired.length > 1 ? "s" : ""}
              </span>
            )}
            {soon.length > 0 && (
              <span className="wt__badge wt__badge--orange">
                {soon.length} bientôt
              </span>
            )}
          </div>
          <div className="wt__list">
            {expiring.slice(0, 4).map((f) => {
              const isExpired = new Date(f.expiryDate).getTime() < Date.now();
              return (
                <div
                  key={f.id}
                  className={`wt__fridge-row ${isExpired ? "wt__fridge-row--expired" : ""}`}
                >
                  <AlertTriangle size={13} />
                  <span className="wt__fridge-name">{f.name}</span>
                  <span className="wt__fridge-qty">{f.quantity}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   5. Habitudes
   ═══════════════════════════════════════ */
export function HabitsWidget({ widgetId }: { widgetId: string }) {
  const goTo = useGoToSection();
  const habits = useTodoStore((s) => s.habits);
  const toggleHabitDay = useTodoStore((s) => s.toggleHabitDay);
  const removeWidget = useWidgetStore((s) => s.removeWidget);

  const todayIdx = (new Date().getDay() + 6) % 7;
  const done = habits.filter((h) => h.completions.includes(todayIdx)).length;

  return (
    <div className="lp-w wt wt--habits">
      <div className="wt__header">
        <h3 className="lp-w__title" onClick={() => goTo("habits")}>
          ✦ Habitudes
        </h3>
        <button className="tw__remove" onClick={() => removeWidget(widgetId)}>
          <Trash2 size={15} />
        </button>
      </div>
      <div className="wt__summary">
        <span className="wt__badge wt__badge--accent">
          {done}/{habits.length} aujourd'hui
        </span>
      </div>
      <div className="wt__list">
        {habits.map((h) => {
          const isDone = h.completions.includes(todayIdx);
          return (
            <div key={h.id} className="wt__habit-row">
              <button
                className={`wt__habit-dot ${isDone ? "wt__habit-dot--done" : ""}`}
                style={{
                  borderColor: h.color,
                  background: isDone ? h.color : "transparent",
                }}
                onClick={() => toggleHabitDay(h.id)}
              >
                {isDone && <Check size={10} color="#fff" strokeWidth={3} />}
              </button>
              <span className="wt__habit-icon">{h.icon}</span>
              <span
                className={`wt__habit-name ${isDone ? "wt__habit-name--done" : ""}`}
              >
                {h.name}
              </span>
            </div>
          );
        })}
        {habits.length === 0 && (
          <p className="wt__empty-line">Aucune habitude configurée</p>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   6. Notes rapides
   ═══════════════════════════════════════ */
export function NotesWidget({ widgetId }: { widgetId: string }) {
  const goTo = useGoToSection();
  const notes = useTodoStore((s) => s.brainNotes);
  const removeWidget = useWidgetStore((s) => s.removeWidget);

  const pinned = notes.filter((n) => n.pinned);
  const recent = notes.filter((n) => !n.pinned).slice(0, 3);

  return (
    <div className="lp-w wt wt--notes">
      <div className="wt__header">
        <h3 className="lp-w__title" onClick={() => goTo("braindump")}>
          💭 Notes rapides
        </h3>
        <button className="tw__remove" onClick={() => removeWidget(widgetId)}>
          <Trash2 size={15} />
        </button>
      </div>
      <div className="wt__summary">
        <span className="wt__badge wt__badge--accent">
          {notes.length} note{notes.length !== 1 ? "s" : ""}
        </span>
        {pinned.length > 0 && (
          <span className="wt__badge wt__badge--muted">
            {pinned.length} épinglée{pinned.length > 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="wt__list">
        {[...pinned, ...recent].slice(0, 4).map((n) => (
          <div key={n.id} className="wt__note-row">
            {n.pinned && <Pin size={11} className="wt__note-pin" />}
            <span className="wt__note-content">
              {n.content.length > 60 ? n.content.slice(0, 60) + "…" : n.content}
            </span>
          </div>
        ))}
        {notes.length === 0 && <p className="wt__empty-line">Aucune note</p>}
      </div>
      {notes.length > 4 && (
        <span className="wt__more" onClick={() => goTo("braindump")}>
          Voir toutes les notes →
        </span>
      )}
    </div>
  );
}
