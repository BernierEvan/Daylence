import { useState, useRef, useEffect, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pin, PinOff, Trash2, Palette, X } from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import { COLOR_PALETTE } from "../types";
import { fmtDateShort } from "../../../lib/utils";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import type { BrainNote } from "../types";

const NOTE_COLORS = ["#ffffff", "#dfe6e9", ...COLOR_PALETTE];

export default function BrainDump() {
  const notes = useTodoStore((s) => s.brainNotes);
  const addNote = useTodoStore((s) => s.addBrainNote);
  const updateNote = useTodoStore((s) => s.updateBrainNote);
  const removeNote = useTodoStore((s) => s.removeBrainNote);
  const togglePin = useTodoStore((s) => s.togglePinNote);
  const updateColor = useTodoStore((s) => s.updateNoteColor);

  const [draft, setDraft] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);
  const [openNote, setOpenNote] = useState<BrainNote | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const draftRef = useRef<HTMLTextAreaElement>(null);
  const modalContentRef = useRef<HTMLTextAreaElement>(null);

  // Sync modal state when a note opens
  useEffect(() => {
    if (openNote) {
      const fresh = notes.find((n) => n.id === openNote.id);
      if (fresh) {
        setEditTitle(fresh.title);
        setEditContent(fresh.content);
      }
    }
  }, [openNote?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmedContent = draft.trim();
    const trimmedTitle = draftTitle.trim();
    if (!trimmedContent && !trimmedTitle) return;
    addNote(trimmedTitle, trimmedContent);
    setDraft("");
    setDraftTitle("");
    // Reset textarea height
    if (draftRef.current) draftRef.current.style.height = "auto";
  };

  const handleModalSave = () => {
    if (!openNote) return;
    const trimTitle = editTitle.trim();
    const trimContent = editContent.trim();
    if (trimTitle !== openNote.title || trimContent !== openNote.content) {
      updateNote(openNote.id, { title: trimTitle, content: trimContent });
    }
    setOpenNote(null);
  };

  const handleOpenNote = (note: BrainNote) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setOpenNote(note);
    // Close color picker if open
    setPickerOpen(null);
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
        <div className="td-brain__form-fields">
          <input
            className="td-brain__title-input"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            placeholder="Titre (optionnel)"
          />
          <textarea
            ref={draftRef}
            className="td-brain__textarea"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              const ta = e.target;
              ta.style.height = "auto";
              ta.style.height = ta.scrollHeight + "px";
            }}
            placeholder="Une idée, un rappel, n'importe quoi…"
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                handleAdd(e);
              }
            }}
          />
        </div>
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
              {note.pinned && (
                <button
                  className="td-brain__pin-badge"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePin(note.id);
                  }}
                  aria-label="Désépingler"
                >
                  <Pin size={13} />
                </button>
              )}

              {/* Clickable area */}
              <div
                className="td-brain__card-body"
                onClick={() => handleOpenNote(note)}
              >
                {note.title && (
                  <h4 className="td-brain__card-title">{note.title}</h4>
                )}
                <p className="td-brain__card-preview">
                  {note.content || (
                    <span className="td-brain__card-empty">Note vide</span>
                  )}
                </p>
              </div>

              <div className="td-brain__actions">
                <button
                  className="td-btn--icon"
                  onClick={() => togglePin(note.id)}
                  aria-label={note.pinned ? "Désépingler" : "Épingler"}
                >
                  {note.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </button>
                <div className="td-brain__color-wrap">
                  <button
                    className="td-btn--icon"
                    onClick={() =>
                      setPickerOpen(pickerOpen === note.id ? null : note.id)
                    }
                    aria-label="Changer la couleur"
                  >
                    <Palette size={14} />
                  </button>
                  {pickerOpen === note.id && (
                    <div className="td-color-picker td-color-picker--note">
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
                </div>
                <button
                  className="td-btn--icon"
                  onClick={() => setDeleteTarget(note.id)}
                  aria-label="Supprimer"
                >
                  <Trash2 size={14} />
                </button>
                <span className="td-brain__time">
                  {fmtDateShort(new Date(note.updatedAt))}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Note modal ── */}
      <AnimatePresence>
        {openNote && (
          <motion.div
            className="td-brain-modal__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleModalSave}
          >
            <motion.div
              className="td-brain-modal"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={
                openNote.color &&
                openNote.color !== "#fff" &&
                openNote.color !== "#ffffff"
                  ? { borderColor: openNote.color }
                  : undefined
              }
            >
              <button
                className="td-brain-modal__close"
                onClick={handleModalSave}
              >
                <X size={18} />
              </button>
              <input
                className="td-brain-modal__title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Titre de la note…"
              />
              <textarea
                ref={modalContentRef}
                className="td-brain-modal__content"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Contenu de la note…"
              />
              <div className="td-brain-modal__footer">
                <span className="td-brain__time">
                  Modifié le {fmtDateShort(new Date(openNote.updatedAt))}
                </span>
                <button
                  className="td-brain-modal__save-btn"
                  onClick={handleModalSave}
                >
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete confirmation ── */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Supprimer cette note ?"
        description="Cette action est irréversible. La note sera définitivement supprimée."
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={() => {
          if (deleteTarget) removeNote(deleteTarget);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
