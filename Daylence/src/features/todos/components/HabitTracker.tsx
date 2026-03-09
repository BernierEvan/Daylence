import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useTodoStore } from "../store/todoStore";

/** Day-of-week indices 0-6 (Mon-Sun). */
const WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6] as const;
const DAY_LABEL = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function HabitTracker() {
  const habits = useTodoStore((s) => s.habits);
  const addHabit = useTodoStore((s) => s.addHabit);
  const removeHabit = useTodoStore((s) => s.removeHabit);
  const toggleDay = useTodoStore((s) => s.toggleHabitDay);

  const [name, setName] = useState("");

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addHabit(trimmed);
    setName("");
  };

  return (
    <div className="td-habits">
      <h2 className="td-section__title">Habitudes</h2>

      {/* header row with day names */}
      <div className="td-habits__grid">
        <div className="td-habits__corner" />
        {WEEK_DAYS.map((d) => (
          <div key={d} className="td-habits__dayhead">
            <span className="td-habits__dayname">{DAY_LABEL[d]}</span>
          </div>
        ))}
        <div className="td-habits__streak-head">Streak</div>

        {/* habit rows */}
        {habits.map((habit) => {
          // Compute current streak
          const streak = habit.completions.length;

          return (
            <div key={habit.id} className="td-habits__row">
              <div className="td-habits__name">
                <span>{habit.icon}</span>
                <span>{habit.name}</span>
                <button
                  className="td-btn--icon td-habits__delete"
                  onClick={() => removeHabit(habit.id)}
                  aria-label="Supprimer habitude"
                >
                  <Trash2 size={12} />
                </button>
              </div>

              {WEEK_DAYS.map((d) => {
                const done = habit.completions.includes(d);
                return (
                  <button
                    key={d}
                    className="td-habits__dot-wrap"
                    onClick={() => toggleDay(habit.id, d)}
                    aria-label={done ? "Annuler" : "Valider"}
                  >
                    <motion.span
                      className="td-habits__dot"
                      animate={{
                        scale: done ? 1 : 0.45,
                        backgroundColor: done
                          ? habit.color
                          : getComputedStyle(document.documentElement)
                              .getPropertyValue("--td-border")
                              .trim() || "#e5e7eb",
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </button>
                );
              })}

              <span className="td-habits__streak">
                {streak > 0 ? `🔥 ${streak}` : "—"}
              </span>
            </div>
          );
        })}
      </div>

      {/* add form */}
      <form className="td-habits__add" onSubmit={handleAdd}>
        <input
          className="td-form__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nouvelle habitude…"
        />
        <button className="td-form__btn" type="submit" aria-label="Ajouter">
          <Plus size={18} />
        </button>
      </form>
    </div>
  );
}
