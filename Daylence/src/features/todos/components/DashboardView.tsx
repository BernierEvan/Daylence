import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  Flame,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import type { Todo } from "../types";

/* ── helpers ── */
const isoDate = (d: Date) => d.toISOString().slice(0, 10);

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

function fmtDayHeader(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const todayISO = isoDate(new Date());
  const tomorrowISO = addDays(todayISO, 1);
  const yesterdayISO = addDays(todayISO, -1);
  if (iso === todayISO) return "Aujourd'hui";
  if (iso === tomorrowISO) return "Demain";
  if (iso === yesterdayISO) return "Hier";
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Check if a recurring todo appears on a given date */
function matchesDate(todo: Todo, iso: string): boolean {
  if (todo.dueDate === iso) return true;
  if (!todo.recurrence) return false;

  const base = new Date(todo.dueDate + "T00:00:00");
  const target = new Date(iso + "T00:00:00");
  if (target < base) return false; // recurrence doesn't go backward
  if (todo.recurrence.endDate && iso > todo.recurrence.endDate) return false;

  const dayOfWeek = (target.getDay() + 6) % 7; // 0=Mon

  switch (todo.recurrence.type) {
    case "daily":
      return true;
    case "weekdays":
      return dayOfWeek < 5;
    case "weekly": {
      const days = todo.recurrence.daysOfWeek ?? [(base.getDay() + 6) % 7];
      return days.includes(dayOfWeek);
    }
    case "monthly":
      return target.getDate() === base.getDate();
    default:
      return false;
  }
}

export default function DashboardView() {
  const todos = useTodoStore((s) => s.todos);
  const fridgeItems = useTodoStore((s) => s.fridgeItems);
  const habits = useTodoStore((s) => s.habits);
  const groceryLists = useTodoStore((s) => s.groceryLists);
  const addTodo = useTodoStore((s) => s.addTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const selectedDate = useTodoStore((s) => s.selectedDate);
  const setSelectedDate = useTodoStore((s) => s.setSelectedDate);

  const todayISO = isoDate(new Date());

  /* build 7-day window centred-ish on selectedDate */
  const weekDates = useMemo(() => {
    const dates: string[] = [];
    for (let i = -1; i < 6; i++) dates.push(addDays(selectedDate, i));
    return dates;
  }, [selectedDate]);

  /* todos for each day */
  const todosByDay = useMemo(() => {
    const map: Record<string, Todo[]> = {};
    for (const date of weekDates) {
      map[date] = todos.filter((t) => !t.completed && matchesDate(t, date));
    }
    return map;
  }, [weekDates, todos]);

  /* stats (using today only) */
  const todayTodos = todos.filter(
    (t) => !t.completed && matchesDate(t, todayISO),
  );
  const completedCount = todos.filter((t) => t.completed).length;

  const expiringSoon = fridgeItems.filter((f) => {
    if (f.consumed) return false;
    const diff =
      (new Date(f.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 2;
  });

  const todayIdx = (new Date().getDay() + 6) % 7;
  const habitsToday = habits.filter((h) =>
    h.completions.includes(todayIdx),
  ).length;

  const uncheckedGrocery = groceryLists.reduce(
    (sum, l) => sum + l.items.filter((i) => !i.checked).length,
    0,
  );

  const cards = [
    {
      icon: <ListTodo size={18} />,
      label: "À faire",
      value: todayTodos.length,
      accent: "#6366f1",
    },
    {
      icon: <CheckCircle2 size={18} />,
      label: "Terminées",
      value: completedCount,
      accent: "#22c55e",
    },
    {
      icon: <Flame size={18} />,
      label: "Habitudes",
      value: `${habitsToday}/${habits.length}`,
      accent: "#f59e0b",
    },
    {
      icon: <ShoppingCart size={18} />,
      label: "Courses",
      value: uncheckedGrocery,
      accent: "#8b5cf6",
    },
  ];

  return (
    <div className="td-dashboard">
      {/* stat cards */}
      <div className="td-dashboard__cards">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            className="td-stat"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <span className="td-stat__icon" style={{ color: c.accent }}>
              {c.icon}
            </span>
            <span className="td-stat__value">{c.value}</span>
            <span className="td-stat__label">{c.label}</span>
          </motion.div>
        ))}
      </div>

      {/* fridge alert */}
      {expiringSoon.length > 0 && (
        <motion.div
          className="td-alert"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <AlertTriangle size={16} />
          <span>
            {expiringSoon.length} produit{expiringSoon.length > 1 ? "s" : ""}{" "}
            bientôt périmé{expiringSoon.length > 1 ? "s" : ""} !
          </span>
        </motion.div>
      )}

      {/* ── date navigation ── */}
      <div className="td-agenda__nav">
        <button
          className="td-btn--icon"
          onClick={() => setSelectedDate(addDays(selectedDate, -1))}
          aria-label="Jour précédent"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className="td-agenda__today-btn"
          onClick={() => setSelectedDate(todayISO)}
        >
          <Calendar size={14} />
          Aujourd'hui
        </button>
        <button
          className="td-btn--icon"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
          aria-label="Jour suivant"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* ── week strip ── */}
      <div className="td-agenda__strip">
        {weekDates.map((d) => {
          const dt = new Date(d + "T00:00:00");
          const isSelected = d === selectedDate;
          const isToday = d === todayISO;
          const count = (todosByDay[d] ?? []).length;
          return (
            <button
              key={d}
              className={`td-agenda__day ${isSelected ? "td-agenda__day--selected" : ""} ${isToday ? "td-agenda__day--today" : ""}`}
              onClick={() => setSelectedDate(d)}
            >
              <span className="td-agenda__day-name">
                {dt.toLocaleDateString("fr-FR", { weekday: "short" })}
              </span>
              <span className="td-agenda__day-num">{dt.getDate()}</span>
              {count > 0 && <span className="td-agenda__day-dot" />}
            </button>
          );
        })}
      </div>

      {/* ── quick add (for selected day) ── */}
      <TodoForm onAdd={addTodo} defaultDate={selectedDate} />

      {/* ── agenda list for selected day ── */}
      <h3 className="td-agenda__day-header">{fmtDayHeader(selectedDate)}</h3>
      <div className="td-dashboard__list">
        <AnimatePresence mode="popLayout">
          {(todosByDay[selectedDate] ?? []).map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={toggleTodo}
              onRemove={removeTodo}
              hideDate
            />
          ))}
        </AnimatePresence>
        {(todosByDay[selectedDate] ?? []).length === 0 && (
          <p className="td-empty">Rien de prévu — profitez-en ! 🎉</p>
        )}
      </div>

      {/* ── completed section ── */}
      {completedCount > 0 && (
        <details className="td-agenda__completed">
          <summary>
            {completedCount} tâche{completedCount > 1 ? "s" : ""} terminée
            {completedCount > 1 ? "s" : ""}
          </summary>
          <div className="td-dashboard__list" style={{ marginTop: 8 }}>
            <AnimatePresence mode="popLayout">
              {todos
                .filter((t) => t.completed)
                .map((t) => (
                  <TodoItem
                    key={t.id}
                    todo={t}
                    onToggle={toggleTodo}
                    onRemove={removeTodo}
                  />
                ))}
            </AnimatePresence>
          </div>
        </details>
      )}
    </div>
  );
}
