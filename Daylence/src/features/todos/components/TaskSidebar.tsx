import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Filter,
  Sunrise,
  Sun,
  Moon,
  CheckCircle2,
  ArrowUpDown,
  Tags,
  ChevronDown,
} from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import TodoItem from "./TodoItem";
import type { Todo, Priority } from "../types";

type SortBy = "priority" | "date" | "name";

/* ── helpers ── */
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

type TimeFilter = "today" | "week" | "month";

function matchesDate(todo: Todo, iso: string): boolean {
  if (todo.dueDate === iso) return true;
  if (!todo.recurrence) return false;
  const base = new Date(todo.dueDate + "T00:00:00");
  const target = new Date(iso + "T00:00:00");
  if (target < base) return false;
  if (todo.recurrence.endDate && iso > todo.recurrence.endDate) return false;
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

/** Get all ISO dates in a range [start, end] inclusive */
function dateRange(start: Date, end: Date): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  while (cur <= end) {
    dates.push(isoDate(cur));
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

/** Check if a todo appears on any date in the range */
function matchesAnyDate(todo: Todo, dates: string[]): boolean {
  return dates.some((d) => matchesDate(todo, d));
}

const TIME_OPTIONS: { key: TimeFilter; label: string }[] = [
  { key: "today", label: "Aujourd'hui" },
  { key: "week", label: "Cette semaine" },
  { key: "month", label: "Ce mois-ci" },
];

const PRIORITY_OPTIONS: {
  key: Priority | "all";
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "all", label: "Toutes", icon: <Filter size={12} /> },
  { key: "high", label: "Haute", icon: <Sunrise size={12} /> },
  { key: "medium", label: "Moyenne", icon: <Sun size={12} /> },
  { key: "low", label: "Basse", icon: <Moon size={12} /> },
];

const SORT_OPTIONS: { key: SortBy; label: string }[] = [
  { key: "priority", label: "Priorité" },
  { key: "date", label: "Date" },
  { key: "name", label: "Nom" },
];

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

export default function TaskSidebar() {
  const todos = useTodoStore((s) => s.todos);
  const categories = useTodoStore((s) => s.categories);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);

  const [timeFilter, setTimeFilter] = useState<TimeFilter>("week");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [sortBy, setSortBy] = useState<SortBy>("priority");
  const [categoryFilter, setCategoryFilter] = useState<string | "all">("all");
  const [showCatDropdown, setShowCatDropdown] = useState(false);

  const activeCat = categories.find((c) => c.id === categoryFilter);

  const filtered = useMemo(() => {
    const now = new Date();
    const todayStr = isoDate(now);

    let dates: string[];
    if (timeFilter === "today") {
      dates = [todayStr];
    } else if (timeFilter === "week") {
      const dayOfWeek = (now.getDay() + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - dayOfWeek);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      dates = dateRange(monday, sunday);
    } else {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      dates = dateRange(firstDay, lastDay);
    }

    return todos.filter((t) => {
      if (t.completed) return false;
      if (!matchesAnyDate(t, dates)) return false;
      if (priorityFilter !== "all" && t.priority !== priorityFilter)
        return false;
      if (categoryFilter !== "all") {
        if (!t.categoryId || t.categoryId !== categoryFilter) return false;
      }
      return true;
    });
  }, [todos, timeFilter, priorityFilter, categoryFilter]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === "date") {
      arr.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    } else if (sortBy === "name") {
      arr.sort((a, b) => a.title.localeCompare(b.title, "fr"));
    } else {
      arr.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
      );
    }
    return arr;
  }, [filtered, sortBy]);

  const grouped = useMemo(() => {
    if (sortBy !== "priority") return null;
    const high = sorted.filter((t) => t.priority === "high");
    const medium = sorted.filter((t) => t.priority === "medium");
    const low = sorted.filter((t) => t.priority === "low");
    return [
      {
        key: "high" as const,
        label: "Prioritaire",
        icon: <Sunrise size={13} />,
        items: high,
      },
      {
        key: "medium" as const,
        label: "Normal",
        icon: <Sun size={13} />,
        items: medium,
      },
      {
        key: "low" as const,
        label: "Secondaire",
        icon: <Moon size={13} />,
        items: low,
      },
    ].filter((g) => g.items.length > 0);
  }, [sorted, sortBy]);

  return (
    <aside className="td-sidebar">
      {/* ── Title ── */}
      <div className="td-sidebar__header">
        <CalendarDays size={16} />
        <h3 className="td-sidebar__title">Tâches à venir</h3>
        <span className="td-sidebar__count">{filtered.length}</span>
      </div>

      {/* ── Time filter ── */}
      <div className="td-sidebar__filters">
        <div className="td-sidebar__filter-row">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`td-sidebar__chip ${timeFilter === opt.key ? "td-sidebar__chip--active" : ""}`}
              onClick={() => setTimeFilter(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="td-sidebar__separator" />

        {/* ── Priority filter ── */}
        <div className="td-sidebar__filter-row">
          {PRIORITY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`td-sidebar__chip td-sidebar__chip--${opt.key} ${priorityFilter === opt.key ? "td-sidebar__chip--active" : ""}`}
              onClick={() => setPriorityFilter(opt.key)}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── Sort ── */}
        <div className="td-sidebar__filter-row td-sidebar__sort-row">
          <ArrowUpDown size={12} className="td-sidebar__sort-icon" />
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`td-sidebar__chip td-sidebar__chip--sort ${sortBy === opt.key ? "td-sidebar__chip--active" : ""}`}
              onClick={() => setSortBy(opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* ── Category filter ── */}
        {categories.length > 0 && (
          <div className="td-sidebar__cat-filter">
            <button
              className={`td-sidebar__chip td-sidebar__chip--cat-toggle ${categoryFilter !== "all" ? "td-sidebar__chip--active" : ""}`}
              onClick={() => setShowCatDropdown((p) => !p)}
            >
              <Tags size={12} />
              {activeCat ? `${activeCat.emoji} ${activeCat.name}` : "Catégorie"}
              <ChevronDown
                size={11}
                style={{
                  transform: showCatDropdown ? "rotate(180deg)" : undefined,
                  transition: "transform 0.15s",
                }}
              />
            </button>
            {showCatDropdown && (
              <div className="td-sidebar__cat-dropdown">
                <button
                  className={`td-sidebar__cat-option ${categoryFilter === "all" ? "td-sidebar__cat-option--active" : ""}`}
                  onClick={() => {
                    setCategoryFilter("all");
                    setShowCatDropdown(false);
                  }}
                >
                  Toutes
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`td-sidebar__cat-option ${categoryFilter === cat.id ? "td-sidebar__cat-option--active" : ""}`}
                    onClick={() => {
                      setCategoryFilter(cat.id);
                      setShowCatDropdown(false);
                    }}
                  >
                    <span
                      className="td-sidebar__cat-dot"
                      style={{ background: cat.color }}
                    />
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Task list ── */}
      <div className="td-sidebar__list">
        {sorted.length === 0 ? (
          <div className="td-sidebar__empty">
            <CheckCircle2 size={24} strokeWidth={1.5} />
            <p>Aucune tâche</p>
          </div>
        ) : grouped ? (
          <AnimatePresence mode="popLayout">
            {grouped.map((group) => (
              <motion.div
                key={group.key}
                className={`td-sidebar__group td-sidebar__group--${group.key}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
              >
                <div
                  className={`td-sidebar__group-header td-sidebar__group-header--${group.key}`}
                >
                  {group.icon}
                  <span>{group.label}</span>
                  <span className="td-sidebar__group-count">
                    {group.items.length}
                  </span>
                </div>
                {group.items.map((t) => (
                  <TodoItem
                    key={t.id}
                    todo={t}
                    onToggle={toggleTodo}
                    onRemove={removeTodo}
                    compact
                  />
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <AnimatePresence mode="popLayout">
            {sorted.map((t) => (
              <TodoItem
                key={t.id}
                todo={t}
                onToggle={toggleTodo}
                onRemove={removeTodo}
                compact
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </aside>
  );
}
