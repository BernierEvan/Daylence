import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CornerDownLeft,
  Sunrise,
  Sun,
  Moon,
  Tags,
  ChevronDown,
} from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import TaskSidebar from "./TaskSidebar";
import CategoryManager from "./CategoryManager";
import type { Todo } from "../types";

/* ── View mode ── */
type CalendarView = "day" | "week" | "month";

const VIEW_OPTIONS: { key: CalendarView; label: string }[] = [
  { key: "day", label: "Jour" },
  { key: "week", label: "Semaine" },
  { key: "month", label: "Mois" },
];

/* ── helpers ── */
const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  return isoDate(d);
}

function fmtDayHeader(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const todayISO = isoDate(new Date());
  if (iso === todayISO) return "Aujourd'hui";
  if (iso === addDays(todayISO, 1)) return "Demain";
  if (iso === addDays(todayISO, -1)) return "Hier";
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/** Does a (possibly recurring) todo appear on a given date? */
function matchesDate(todo: Todo, iso: string): boolean {
  if (todo.dueDate === iso) return true;
  if (!todo.recurrence) return false;

  const base = new Date(todo.dueDate + "T00:00:00");
  const target = new Date(iso + "T00:00:00");
  if (target < base) return false;
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

function groupByPriority(todos: Todo[]) {
  return {
    high: todos.filter((t) => t.priority === "high"),
    medium: todos.filter((t) => t.priority === "medium"),
    low: todos.filter((t) => t.priority === "low"),
  };
}

const PRIORITY_SECTIONS = [
  { key: "high" as const, label: "Prioritaire", icon: <Sunrise size={14} /> },
  { key: "medium" as const, label: "Normal", icon: <Sun size={14} /> },
  { key: "low" as const, label: "Secondaire", icon: <Moon size={14} /> },
];

/** French day headers for the calendar grid (Mon–Sun) */
const CAL_DAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

/** Build all calendar cells for a given month view (aligned to Mon start) */
function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  // Day-of-week for first day (0=Mon)
  const startDow = (first.getDay() + 6) % 7;
  // Pad with previous month days
  const cells: { iso: string; day: number; inMonth: boolean }[] = [];
  for (let i = startDow - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    cells.push({ iso: isoDate(d), day: d.getDate(), inMonth: false });
  }
  // Current month days
  for (let d = 1; d <= last.getDate(); d++) {
    const dt = new Date(year, month, d);
    cells.push({ iso: isoDate(dt), day: d, inMonth: true });
  }
  // Pad end to fill last week row
  while (cells.length % 7 !== 0) {
    const d = new Date(
      year,
      month + 1,
      cells.length - startDow - last.getDate() + 1,
    );
    cells.push({ iso: isoDate(d), day: d.getDate(), inMonth: false });
  }
  return cells;
}

const PRIORITY_DOT_CLASS: Record<string, string> = {
  high: "td-cal__cell-dot--high",
  medium: "td-cal__cell-dot--medium",
  low: "td-cal__cell-dot--low",
};

/* ── Week view helpers ── */
function getWeekDays(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const dow = (d.getDay() + 6) % 7; // 0=Mon
  const monday = new Date(d);
  monday.setDate(d.getDate() - dow);
  const days: { iso: string; day: number; dow: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(monday);
    cur.setDate(monday.getDate() + i);
    days.push({ iso: isoDate(cur), day: cur.getDate(), dow: i });
  }
  return days;
}

function fmtWeekLabel(iso: string) {
  const days = getWeekDays(iso);
  const mon = new Date(days[0].iso + "T00:00:00");
  const sun = new Date(days[6].iso + "T00:00:00");
  const fmt = (d: Date) =>
    d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  return `${fmt(mon)} – ${fmt(sun)}`;
}

export default function DashboardView() {
  const todos = useTodoStore((s) => s.todos);
  const addTodo = useTodoStore((s) => s.addTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const selectedDate = useTodoStore((s) => s.selectedDate);
  const setSelectedDate = useTodoStore((s) => s.setSelectedDate);

  const todayISO = isoDate(new Date());

  const [calView, setCalView] = useState<CalendarView>("month");
  const [showCatMgr, setShowCatMgr] = useState(false);

  /* Viewed month is driven by year/month state */
  const [viewYear, setViewYear] = useState(() => {
    const d = new Date(selectedDate + "T00:00:00");
    return d.getFullYear();
  });
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(selectedDate + "T00:00:00");
    return d.getMonth();
  });

  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  /* Navigation */
  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };
  const prevWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };
  const nextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };
  const prevDay = () => {
    setSelectedDate(addDays(selectedDate, -1));
  };
  const nextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };
  const goToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    setSelectedDate(todayISO);
  };

  const isCurrentMonth =
    viewYear === new Date().getFullYear() &&
    viewMonth === new Date().getMonth();

  /* Task data per calendar cell (counts + priority breakdown) */
  const cellData = useMemo(() => {
    const cells =
      calView === "week"
        ? weekDays.map((d) => d.iso)
        : calendarDays.map((d) => d.iso);
    const map: Record<
      string,
      { total: number; high: number; medium: number; low: number }
    > = {};
    for (const iso of cells) {
      let high = 0,
        medium = 0,
        low = 0;
      for (const t of todos) {
        if (t.completed || !matchesDate(t, iso)) continue;
        if (t.priority === "high") high++;
        else if (t.priority === "medium") medium++;
        else low++;
      }
      map[iso] = { total: high + medium + low, high, medium, low };
    }
    return map;
  }, [calendarDays, weekDays, calView, todos]);

  /* Todos for the selected day */
  const dayTodos = useMemo(
    () => todos.filter((t) => !t.completed && matchesDate(t, selectedDate)),
    [todos, selectedDate],
  );
  const grouped = useMemo(() => groupByPriority(dayTodos), [dayTodos]);

  const completedToday = useMemo(
    () => todos.filter((t) => t.completed && matchesDate(t, selectedDate)),
    [todos, selectedDate],
  );

  /* Click a calendar cell — also navigate month if out-of-month cell */
  const selectDay = (iso: string) => {
    setSelectedDate(iso);
    const d = new Date(iso + "T00:00:00");
    if (d.getFullYear() !== viewYear || d.getMonth() !== viewMonth) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
  };

  /* ── Navigation header label + arrows per view ── */
  const navLabel =
    calView === "month"
      ? monthLabel
      : calView === "week"
        ? fmtWeekLabel(selectedDate)
        : fmtDayHeader(selectedDate);

  const onPrev =
    calView === "month" ? prevMonth : calView === "week" ? prevWeek : prevDay;
  const onNext =
    calView === "month" ? nextMonth : calView === "week" ? nextWeek : nextDay;

  const showTodayBtn =
    calView === "month" ? !isCurrentMonth : selectedDate !== todayISO;

  /* ── Render the selected day panel (shared by all views) ── */
  const renderDayPanel = () => (
    <motion.div
      className="td-cal__panel"
      key={selectedDate}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="td-cal__panel-header">
        <h3 className="td-cal__panel-title">{fmtDayHeader(selectedDate)}</h3>
        <span className="td-cal__panel-count">
          {dayTodos.length} tâche{dayTodos.length !== 1 ? "s" : ""}
        </span>
      </div>

      <TodoForm onAdd={addTodo} defaultDate={selectedDate} />

      {dayTodos.length === 0 ? (
        <div className="td-cal__empty">
          <Calendar size={28} strokeWidth={1.5} />
          <p>Rien de prévu</p>
        </div>
      ) : (
        <div className="td-cal__sections">
          {PRIORITY_SECTIONS.map((sec) => {
            const items = grouped[sec.key];
            if (!items.length) return null;
            return (
              <div
                key={sec.key}
                className={`td-cal__section td-cal__section--${sec.key}`}
              >
                <div
                  className={`td-cal__section-header td-cal__section-header--${sec.key}`}
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                  <span className="td-cal__section-count">{items.length}</span>
                </div>
                <div className="td-cal__section-list">
                  <AnimatePresence mode="popLayout">
                    {items.map((t) => (
                      <TodoItem
                        key={t.id}
                        todo={t}
                        onToggle={toggleTodo}
                        onRemove={removeTodo}
                        hideDate
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {completedToday.length > 0 && (
        <details className="td-cal__completed">
          <summary>
            {completedToday.length} terminée
            {completedToday.length > 1 ? "s" : ""}
          </summary>
          <div className="td-cal__section-list" style={{ marginTop: 8 }}>
            <AnimatePresence mode="popLayout">
              {completedToday.map((t) => (
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
    </motion.div>
  );

  return (
    <div className="td-cal-layout">
      {/* ── Left: Agenda ── */}
      <div className="td-cal">
        {/* ── Toolbar: view toggle + nav ── */}
        <div className="td-cal__toolbar">
          {/* View selector + category manager toggle */}
          <div className="td-cal__toolbar-left">
            <div className="td-cal__view-toggle">
              {VIEW_OPTIONS.map((v) => (
                <button
                  key={v.key}
                  className={`td-cal__view-btn ${calView === v.key ? "td-cal__view-btn--active" : ""}`}
                  onClick={() => setCalView(v.key)}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <button
              className={`td-cal__cat-toggle ${showCatMgr ? "td-cal__cat-toggle--active" : ""}`}
              onClick={() => setShowCatMgr((p) => !p)}
              title="Gérer les catégories"
            >
              <Tags size={14} />
              Catégories
              <ChevronDown
                size={11}
                style={{
                  transform: showCatMgr ? "rotate(180deg)" : undefined,
                  transition: "transform 0.15s",
                }}
              />
            </button>
          </div>

          {/* Navigation: today | < label > */}
          <div className="td-cal__nav">
            {showTodayBtn && (
              <button className="td-cal__today-btn" onClick={goToday}>
                <CornerDownLeft size={11} /> Aujourd'hui
              </button>
            )}
            <button
              className="td-cal__arrow"
              onClick={onPrev}
              aria-label="Précédent"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="td-cal__nav-label">{navLabel}</span>
            <button
              className="td-cal__arrow"
              onClick={onNext}
              aria-label="Suivant"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* ── Category manager (collapsible) ── */}
        <AnimatePresence>
          {showCatMgr && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: "hidden" }}
            >
              <CategoryManager />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Calendar area ── */}
        <div className="td-cal__calendar-area">
          {/* Month grid */}
          {calView === "month" && (
            <div className="td-cal__grid">
              {CAL_DAY_HEADERS.map((d) => (
                <div key={d} className="td-cal__dow">
                  {d}
                </div>
              ))}
              {calendarDays.map((cell) => {
                const isSel = cell.iso === selectedDate;
                const isToday = cell.iso === todayISO;
                const data = cellData[cell.iso];
                const dots: string[] = [];
                if (data) {
                  if (data.high) dots.push(PRIORITY_DOT_CLASS.high);
                  if (data.medium) dots.push(PRIORITY_DOT_CLASS.medium);
                  if (data.low) dots.push(PRIORITY_DOT_CLASS.low);
                }
                return (
                  <button
                    key={cell.iso}
                    className={[
                      "td-cal__cell",
                      !cell.inMonth && "td-cal__cell--out",
                      isSel && "td-cal__cell--sel",
                      isToday && !isSel && "td-cal__cell--today",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => selectDay(cell.iso)}
                  >
                    <span className="td-cal__cell-num">{cell.day}</span>
                    {dots.length > 0 && (
                      <span className="td-cal__cell-dots">
                        {dots.map((cls, i) => (
                          <span
                            key={i}
                            className={`td-cal__cell-dot ${cls} ${isSel ? "td-cal__cell-dot--sel" : ""}`}
                          />
                        ))}
                      </span>
                    )}
                    {data && data.total > 0 && (
                      <span className="td-cal__cell-count">{data.total}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Week strip — redesigned */}
          {calView === "week" && (
            <div className="td-cal__week-strip">
              {weekDays.map((wd) => {
                const isSel = wd.iso === selectedDate;
                const isToday = wd.iso === todayISO;
                const data = cellData[wd.iso];
                return (
                  <button
                    key={wd.iso}
                    className={[
                      "td-cal__week-cell",
                      isSel && "td-cal__week-cell--sel",
                      isToday && !isSel && "td-cal__week-cell--today",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => selectDay(wd.iso)}
                  >
                    <span className="td-cal__week-dow">
                      {CAL_DAY_HEADERS[wd.dow]}
                    </span>
                    <span className="td-cal__week-num">{wd.day}</span>
                    {data && data.total > 0 ? (
                      <span className="td-cal__week-dots">
                        {data.high > 0 && (
                          <span className="td-cal__week-dot td-cal__cell-dot--high" />
                        )}
                        {data.medium > 0 && (
                          <span className="td-cal__week-dot td-cal__cell-dot--medium" />
                        )}
                        {data.low > 0 && (
                          <span className="td-cal__week-dot td-cal__cell-dot--low" />
                        )}
                      </span>
                    ) : (
                      <span className="td-cal__week-dots" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Divider ── */}
        <div className="td-cal__divider" />

        {/* ── Day panel ── */}
        {renderDayPanel()}
      </div>

      {/* ── Right: Task Sidebar ── */}
      <TaskSidebar />
    </div>
  );
}
