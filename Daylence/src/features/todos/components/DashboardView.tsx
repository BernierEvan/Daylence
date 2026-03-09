import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  Flame,
  ShoppingCart,
} from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

export default function DashboardView() {
  const todos = useTodoStore((s) => s.todos);
  const fridgeItems = useTodoStore((s) => s.fridgeItems);
  const habits = useTodoStore((s) => s.habits);
  const groceryItems = useTodoStore((s) => s.groceryItems);
  const addTodo = useTodoStore((s) => s.addTodo);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);

  const todayISO = new Date().toISOString().slice(0, 10);
  const todayTodos = todos.filter(
    (t) => !t.completed && (!t.dueDate || t.dueDate <= todayISO),
  );
  const completedToday = todos.filter((t) => t.completed).length;

  const expiringSoon = fridgeItems.filter((f) => {
    if (f.consumed) return false;
    const diff =
      (new Date(f.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 2;
  });

  const todayIdx = (new Date().getDay() + 6) % 7; // 0=Mon
  const habitsToday = habits.filter((h) =>
    h.completions.includes(todayIdx),
  ).length;

  const uncheckedGrocery = groceryItems.filter((g) => !g.checked).length;

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
      value: completedToday,
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
      <h2 className="td-section__title">Aujourd'hui</h2>

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

      {/* quick add */}
      <TodoForm onAdd={addTodo} />

      {/* today's tasks */}
      <div className="td-dashboard__list">
        <AnimatePresence mode="popLayout">
          {todayTodos.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={toggleTodo}
              onRemove={removeTodo}
            />
          ))}
        </AnimatePresence>
        {todayTodos.length === 0 && (
          <p className="td-empty">Rien à faire — bravo ! 🎉</p>
        )}
      </div>
    </div>
  );
}
