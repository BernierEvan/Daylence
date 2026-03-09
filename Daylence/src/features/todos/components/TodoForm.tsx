import { useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import type { Priority } from "../types";

interface Props {
  onAdd: (title: string, priority?: Priority, dueDate?: string) => void;
  placeholder?: string;
}

export default function TodoForm({
  onAdd,
  placeholder = "Ajouter une tâche…",
}: Props) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle("");
  };

  return (
    <form className="td-form" onSubmit={handleSubmit}>
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
    </form>
  );
}
