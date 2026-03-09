import { motion } from "framer-motion";
import { Check, Trash2, Flag, Repeat } from "lucide-react";
import type { Todo } from "../types";
import { RECURRENCE_LABELS } from "../types";
import { fmtDateShort } from "../../../lib/utils";

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  hideDate?: boolean;
}

const PRIORITY_COLOR: Record<string, string> = {
  high: "#e74c3c",
  medium: "#f39c12",
  low: "#95a5a6",
};

export default function TodoItem({
  todo,
  onToggle,
  onRemove,
  hideDate,
}: Props) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      className={`td-item ${todo.completed ? "td-item--done" : ""}`}
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

      {todo.recurrence && (
        <span
          className="td-item__recurrence"
          title={RECURRENCE_LABELS[todo.recurrence.type]}
        >
          <Repeat size={12} />
        </span>
      )}

      <Flag
        size={12}
        className="td-item__flag"
        style={{ color: PRIORITY_COLOR[todo.priority] }}
      />

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
