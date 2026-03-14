import { useState, type FormEvent } from "react";
import { Plus, ChevronDown } from "lucide-react";
import {
  type Priority,
  type RecurrenceType,
  type Recurrence,
  RECURRENCE_LABELS,
} from "../types";
import { useTodoStore } from "../store/todoStore";

interface Props {
  onAdd: (
    title: string,
    priority?: Priority,
    dueDate?: string,
    recurrence?: Recurrence,
    categoryId?: string,
  ) => void;
  defaultDate?: string;
  placeholder?: string;
}

const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "low", label: "Basse" },
  { value: "medium", label: "Moyenne" },
  { value: "high", label: "Haute" },
];

const RECURRENCE_TYPES: RecurrenceType[] = [
  "none",
  "daily",
  "weekdays",
  "weekly",
  "monthly",
];

export default function TodoForm({
  onAdd,
  defaultDate,
  placeholder = "Ajouter une tâche…",
}: Props) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(() => {
    if (defaultDate) return defaultDate;
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
  const [priority, setPriority] = useState<Priority>("medium");
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("none");
  const [categoryId, setCategoryId] = useState<string>("");
  const [expanded, setExpanded] = useState(false);

  const categories = useTodoStore((s) => s.categories);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    const recurrence: Recurrence | undefined =
      recurrenceType === "none" ? undefined : { type: recurrenceType };
    onAdd(trimmed, priority, dueDate, recurrence, categoryId || undefined);
    setTitle("");
    setRecurrenceType("none");
    setCategoryId("");
  };

  return (
    <form className="td-form td-form--agenda" onSubmit={handleSubmit}>
      <div className="td-form__row">
        <input
          className="td-form__input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={placeholder}
        />
        <button className="td-form__btn" type="submit" aria-label="Ajouter">
          <Plus size={18} />
        </button>
      </div>

      {/* expand toggle */}
      <button
        type="button"
        className="td-form__expand"
        onClick={() => setExpanded((p) => !p)}
      >
        <ChevronDown
          size={14}
          style={{
            transform: expanded ? "rotate(180deg)" : undefined,
            transition: "transform 0.2s",
          }}
        />
        {expanded ? "Moins d'options" : "Plus d'options"}
      </button>

      {expanded && (
        <div className="td-form__options">
          {/* date */}
          <label className="td-form__field">
            <span className="td-form__label">Date</span>
            <input
              className="td-form__input td-form__input--sm"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>

          {/* priority */}
          <label className="td-form__field">
            <span className="td-form__label">Priorité</span>
            <div className="td-form__priority-group">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  className={`td-form__priority-btn td-form__priority-btn--${p.value} ${priority === p.value ? "td-form__priority-btn--active" : ""}`}
                  onClick={() => setPriority(p.value)}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </label>

          {/* recurrence */}
          <label className="td-form__field">
            <span className="td-form__label">Répétition</span>
            <select
              className="td-form__select"
              value={recurrenceType}
              onChange={(e) =>
                setRecurrenceType(e.target.value as RecurrenceType)
              }
            >
              {RECURRENCE_TYPES.map((r) => (
                <option key={r} value={r}>
                  {RECURRENCE_LABELS[r]}
                </option>
              ))}
            </select>
          </label>

          {/* category */}
          {categories.length > 0 && (
            <label className="td-form__field">
              <span className="td-form__label">Catégorie</span>
              <div className="td-form__cat-picker">
                <button
                  type="button"
                  className={`td-form__cat-btn ${!categoryId ? "td-form__cat-btn--active" : ""}`}
                  onClick={() => setCategoryId("")}
                >
                  Aucune
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`td-form__cat-btn ${categoryId === cat.id ? "td-form__cat-btn--active" : ""}`}
                    style={
                      categoryId === cat.id
                        ? { background: cat.color, color: "#fff" }
                        : { background: cat.color + "22", color: cat.color }
                    }
                    onClick={() => setCategoryId(cat.id)}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>
            </label>
          )}
        </div>
      )}
    </form>
  );
}
