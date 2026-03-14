import { motion } from "framer-motion";
import { Check, Trash2, Flag, Repeat } from "lucide-react";
import type { Todo } from "../types";
import { RECURRENCE_LABELS } from "../types";
import { fmtDateShort } from "../../../lib/utils";
import { useTodoStore } from "../store/todoStore";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  hideDate?: boolean;
  compact?: boolean;
}

const PRIORITY_LABEL: Record<string, string> = {
  high: "!!!",
  medium: "!!",
  low: "·",
};

export default function TodoItem({
  todo,
  onToggle,
  onRemove,
  hideDate,
  compact,
}: Props) {
  const category = useTodoStore((s) =>
    todo.categoryId
      ? s.categories.find((c) => c.id === todo.categoryId)
      : undefined,
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className={`td-item ${todo.completed ? "td-item--done" : ""} ${compact ? "td-item--compact" : ""}`}
    >
      <button
        className="td-item__check"
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? "Marquer non fait" : "Marquer fait"}
      >
        {todo.completed ? (
          <Check size={14} strokeWidth={3} />
        ) : (
          <span className="td-item__circle" />
        )}
      </button>

      <span className="td-item__title">{todo.title}</span>

      {category && (
        <span
          className="td-cat-badge td-cat-badge--sm"
          style={{ background: category.color + "22", color: category.color }}
        >
          {category.emoji} {!compact && category.name}
        </span>
      )}

      {todo.recurrence && (
        <span
          className="td-item__recurrence"
          title={RECURRENCE_LABELS[todo.recurrence.type]}
        >
          <Repeat size={12} />
        </span>
      )}

      <span className={`td-item__priority td-item__priority--${todo.priority}`}>
        <Flag size={12} className="td-item__flag" />
        <span className="td-item__flag-label">
          {PRIORITY_LABEL[todo.priority]}
        </span>
      </span>

      {!hideDate && todo.dueDate && (
        <span className="td-item__date">
          {fmtDateShort(new Date(todo.dueDate))}
        </span>
      )}

      <button
        className="td-item__delete"
        onClick={() => onRemove(todo.id)}
        aria-label="Supprimer"
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}
