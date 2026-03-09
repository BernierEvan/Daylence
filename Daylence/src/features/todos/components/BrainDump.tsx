import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pin, PinOff, Trash2, Palette } from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import { COLOR_PALETTE } from "../types";
import { fmtDateShort } from "../../../lib/utils";

const NOTE_COLORS = ["#ffffff", "#dfe6e9", ...COLOR_PALETTE];

export default function BrainDump() {
  const notes = useTodoStore((s) => s.brainNotes);
  const addNote = useTodoStore((s) => s.addBrainNote);
  const updateNote = useTodoStore((s) => s.updateBrainNote);
  const removeNote = useTodoStore((s) => s.removeBrainNote);
  const togglePin = useTodoStore((s) => s.togglePinNote);
  const updateColor = useTodoStore((s) => s.updateNoteColor);

  const [draft, setDraft] = useState("");
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    addNote(trimmed);
    setDraft("");
  };

  // Pinned first, then by creation date desc
  const sorted = [...notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="td-brain">
      <h2 className="td-section__title">Brain Dump</h2>

      {/* quick add */}
      <form className="td-brain__form" onSubmit={handleAdd}>
        <textarea
          className="td-brain__textarea"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Une idée, un rappel, n'importe quoi…"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              handleAdd(e);
            }
          }}
        />
        <button className="td-form__btn" type="submit" aria-label="Ajouter">
          <Plus size={18} />
        </button>
      </form>

      {/* notes grid */}
      <div className="td-brain__grid">
        <AnimatePresence mode="popLayout">
          {sorted.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`td-brain__card ${note.pinned ? "td-brain__card--pinned" : ""}`}
              style={
                note.color && note.color !== "#fff" && note.color !== "#ffffff"
                  ? {
                      borderColor: note.color,
                      background: `${note.color}18`,
                    }
                  : undefined
              }
            >
              <textarea
                className="td-brain__content"
                defaultValue={note.content}
                onBlur={(e) => {
                  const val = e.target.value.trim();
                  if (val && val !== note.content) {
                    updateNote(note.id, val);
                  }
                }}
                rows={3}
              />
              <div className="td-brain__actions">
                <button
                  className="td-btn--icon"
                  onClick={() => togglePin(note.id)}
                  aria-label={note.pinned ? "Désépingler" : "Épingler"}
                >
                  {note.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
                <button
                  className="td-btn--icon"
                  onClick={() =>
                    setPickerOpen(pickerOpen === note.id ? null : note.id)
                  }
                  aria-label="Changer la couleur"
                >
                  <Palette size={14} />
                </button>
                <button
                  className="td-btn--icon"
                  onClick={() => removeNote(note.id)}
                  aria-label="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
                <span className="td-brain__time">
                  {fmtDateShort(new Date(note.updatedAt))}
                </span>
              </div>
              {pickerOpen === note.id && (
                <div className="td-color-picker td-color-picker--card">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`td-color-picker__dot${c === note.color ? " td-color-picker__dot--active" : ""}`}
                      style={{ background: c }}
                      onClick={() => {
                        updateColor(note.id, c);
                        setPickerOpen(null);
                      }}
                      aria-label={c}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
