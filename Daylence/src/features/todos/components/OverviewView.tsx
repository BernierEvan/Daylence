import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ListTodo,
  ShoppingCart,
  UtensilsCrossed,
  AlertTriangle,
  Flame,
  StickyNote,
  ChevronRight,
} from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import type { Todo, TodoModule } from "../types";

/* ── helpers ── */
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function matchesToday(todo: Todo, todayISO: string): boolean {
  if (todo.dueDate === todayISO) return true;
  if (!todo.recurrence) return false;
  const base = new Date(todo.dueDate + "T00:00:00");
  const target = new Date(todayISO + "T00:00:00");
  if (target < base) return false;
  if (todo.recurrence.endDate && todayISO > todo.recurrence.endDate)
    return false;
  const dayOfWeek = (target.getDay() + 6) % 7;
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

interface Props {
  onNavigate: (m: TodoModule) => void;
}

export default function OverviewView({ onNavigate }: Props) {
  const todos = useTodoStore((s) => s.todos);
  const groceryLists = useTodoStore((s) => s.groceryLists);
  const mealSlots = useTodoStore((s) => s.mealSlots);
  const fridgeItems = useTodoStore((s) => s.fridgeItems);
  const habits = useTodoStore((s) => s.habits);
  const brainNotes = useTodoStore((s) => s.brainNotes);

  const now = new Date();
  const todayISO = isoDate(now);
  const todayIdx = (now.getDay() + 6) % 7;
  const nowMs = now.getTime();

  const stats = useMemo(() => {
    const todayTodos = todos.filter(
      (t) => !t.completed && matchesToday(t, todayISO),
    );
    const completedToday = todos.filter(
      (t) => t.completed && matchesToday(t, todayISO),
    );
    const totalToday = todayTodos.length + completedToday.length;

    const totalGroceryItems = groceryLists.reduce(
      (s, l) => s + l.items.length,
      0,
    );
    const checkedGrocery = groceryLists.reduce(
      (s, l) => s + l.items.filter((i) => i.checked).length,
      0,
    );

    const filledMeals = mealSlots.filter((m) => m.title.trim()).length;
    const totalMealSlots = 7 * 4; // 7 days × 4 meals

    const expiringSoon = fridgeItems.filter((f) => {
      if (f.consumed) return false;
      const diff =
        (new Date(f.expiryDate).getTime() - nowMs) / (1000 * 60 * 60 * 24);
      return diff <= 2;
    });
    const activeItems = fridgeItems.filter((f) => !f.consumed).length;

    const habitsCompleted = habits.filter((h) =>
      h.completions.includes(todayIdx),
    ).length;

    const pinnedNotes = brainNotes.filter((n) => n.pinned).length;

    return {
      todayTodos: todayTodos.length,
      completedToday: completedToday.length,
      totalToday,
      totalGroceryItems,
      checkedGrocery,
      groceryPercent:
        totalGroceryItems > 0
          ? Math.round((checkedGrocery / totalGroceryItems) * 100)
          : 0,
      filledMeals,
      totalMealSlots,
      mealsPercent:
        totalMealSlots > 0
          ? Math.round((filledMeals / totalMealSlots) * 100)
          : 0,
      expiringSoon: expiringSoon.length,
      activeItems,
      habitsCompleted,
      habitsTotal: habits.length,
      totalNotes: brainNotes.length,
      pinnedNotes,
    };
  }, [
    todos,
    groceryLists,
    mealSlots,
    fridgeItems,
    habits,
    brainNotes,
    todayISO,
    todayIdx,
    nowMs,
  ]);

  const cards: {
    key: TodoModule;
    icon: React.ReactNode;
    title: string;
    value: string;
    sub: string;
    accent: string;
    alert?: boolean;
  }[] = [
    {
      key: "dashboard",
      icon: <ListTodo size={20} />,
      title: "Tâches du jour",
      value: `${stats.completedToday}/${stats.totalToday}`,
      sub: `${stats.todayTodos} restante${stats.todayTodos !== 1 ? "s" : ""}`,
      accent: "#6366f1",
    },
    {
      key: "grocery",
      icon: <ShoppingCart size={20} />,
      title: "Courses",
      value: `${stats.groceryPercent}%`,
      sub: `${stats.checkedGrocery}/${stats.totalGroceryItems} articles`,
      accent: "#8b5cf6",
    },
    {
      key: "meals",
      icon: <UtensilsCrossed size={20} />,
      title: "Repas",
      value: `${stats.filledMeals}`,
      sub: `repas planifiés cette semaine`,
      accent: "#f59e0b",
    },
    {
      key: "fridge",
      icon: <AlertTriangle size={20} />,
      title: "Frigo",
      value: `${stats.activeItems}`,
      sub:
        stats.expiringSoon > 0
          ? `⚠ ${stats.expiringSoon} bientôt périmé${stats.expiringSoon > 1 ? "s" : ""}`
          : "Tout est frais",
      accent: "#22c55e",
      alert: stats.expiringSoon > 0,
    },
    {
      key: "habits",
      icon: <Flame size={20} />,
      title: "Habitudes",
      value: `${stats.habitsCompleted}/${stats.habitsTotal}`,
      sub: "complétées aujourd'hui",
      accent: "#f97316",
    },
    {
      key: "braindump",
      icon: <StickyNote size={20} />,
      title: "Notes",
      value: `${stats.totalNotes}`,
      sub: `${stats.pinnedNotes} épinglée${stats.pinnedNotes !== 1 ? "s" : ""}`,
      accent: "#ec4899",
    },
  ];

  // Progress ring for tasks
  const taskProgress =
    stats.totalToday > 0 ? stats.completedToday / stats.totalToday : 0;
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference * (1 - taskProgress);

  return (
    <div className="td-overview">
      {/* ── Hero card: today summary ── */}
      <motion.div
        className="td-overview__hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="td-overview__ring">
          <svg viewBox="0 0 100 100" width="96" height="96">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--td-border)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--td-accent)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 50 50)"
              style={{ transition: "stroke-dashoffset 0.6s ease" }}
            />
          </svg>
          <div className="td-overview__ring-label">
            <span className="td-overview__ring-value">
              {stats.completedToday}
            </span>
            <span className="td-overview__ring-total">/{stats.totalToday}</span>
          </div>
        </div>
        <div className="td-overview__hero-body">
          <h2 className="td-overview__hero-title">Aujourd'hui</h2>
          <p className="td-overview__hero-sub">
            {stats.totalToday === 0
              ? "Rien de prévu — journée libre ! 🎉"
              : stats.todayTodos === 0
                ? "Tout est fait — bien joué ! ✅"
                : `${stats.todayTodos} tâche${stats.todayTodos > 1 ? "s" : ""} restante${stats.todayTodos > 1 ? "s" : ""}`}
          </p>
          {stats.expiringSoon > 0 && (
            <p className="td-overview__hero-alert">
              <AlertTriangle size={14} />
              {stats.expiringSoon} produit{stats.expiringSoon > 1 ? "s" : ""}{" "}
              bientôt périmé{stats.expiringSoon > 1 ? "s" : ""}
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Module cards grid ── */}
      <div className="td-overview__grid">
        {cards.map((c, i) => (
          <motion.button
            key={c.key}
            className={`td-overview__card ${c.alert ? "td-overview__card--alert" : ""}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.04 }}
            onClick={() => onNavigate(c.key)}
          >
            <span
              className="td-overview__card-icon"
              style={{ background: c.accent + "14", color: c.accent }}
            >
              {c.icon}
            </span>
            <div className="td-overview__card-body">
              <span className="td-overview__card-title">{c.title}</span>
              <span className="td-overview__card-value">{c.value}</span>
              <span className="td-overview__card-sub">{c.sub}</span>
            </div>
            <ChevronRight size={14} className="td-overview__card-arrow" />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
