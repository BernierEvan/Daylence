import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import { COLOR_PALETTE } from "../types";

const EMOJI_SUGGESTIONS = [
  "🎂",
  "🏠",
  "💼",
  "🏋️",
  "📚",
  "🎵",
  "✈️",
  "💊",
  "🧹",
  "🎯",
  "💡",
  "🛒",
  "❤️",
  "🎮",
  "🌿",
  "📅",
  "⭐",
  "🔥",
  "🎁",
  "📞",
  "🐾",
  "🍽️",
  "💰",
  "🚗",
];

export default function CategoryManager() {
  const categories = useTodoStore((s) => s.categories);
  const addCategory = useTodoStore((s) => s.addCategory);
  const updateCategory = useTodoStore((s) => s.updateCategory);
  const removeCategory = useTodoStore((s) => s.removeCategory);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [emoji, setEmoji] = useState("🎂");
  const [name, setName] = useState("");
  const [color, setColor] = useState(COLOR_PALETTE[0]);

  const resetForm = () => {
    setEmoji("🎂");
    setName("");
    setColor(COLOR_PALETTE[0]);
    setIsAdding(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    addCategory(emoji, name.trim(), color);
    resetForm();
  };

  const handleEdit = () => {
    if (!editingId || !name.trim()) return;
    updateCategory(editingId, { emoji, name: name.trim(), color });
    resetForm();
  };

  const startEdit = (cat: {
    id: string;
    emoji: string;
    name: string;
    color: string;
  }) => {
    setEditingId(cat.id);
    setEmoji(cat.emoji);
    setName(cat.name);
    setColor(cat.color);
    setIsAdding(false);
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const isFormOpen = isAdding || editingId !== null;

  return (
    <div className="td-catmgr">
      {/* ── Chip list: categories + add button ── */}
      <div className="td-catmgr__chips">
        {categories.map((cat) => (
          <div key={cat.id} className="td-catmgr__chip-wrap">
            <span
              className={`td-catmgr__chip ${editingId === cat.id ? "td-catmgr__chip--editing" : ""}`}
              style={{
                background: cat.color + "18",
                color: cat.color,
                borderColor: cat.color + "40",
              }}
            >
              <span className="td-catmgr__chip-content">
                {cat.emoji} {cat.name}
              </span>
              <span className="td-catmgr__chip-actions">
                <button onClick={() => startEdit(cat)} title="Modifier">
                  <Pencil size={11} />
                </button>
                <button
                  onClick={() => removeCategory(cat.id)}
                  title="Supprimer"
                >
                  <Trash2 size={11} />
                </button>
              </span>
            </span>
          </div>
        ))}
        {!isFormOpen && (
          <button className="td-catmgr__add-chip" onClick={startAdd}>
            <Plus size={12} /> Nouvelle
          </button>
        )}
      </div>

      {/* ── Inline form (add / edit) ── */}
      {isFormOpen && (
        <div className="td-catmgr__form">
          {/* Row 1: emoji + name + preview */}
          <div className="td-catmgr__form-top">
            <div className="td-catmgr__emoji-pick">
              <button
                className="td-catmgr__emoji-current"
                style={{ background: color + "18", borderColor: color + "40" }}
                title="Choisir un emoji ci-dessous"
              >
                {emoji}
              </button>
            </div>
            <input
              className="td-catmgr__name-input"
              type="text"
              maxLength={30}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom de la catégorie…"
              autoFocus
            />
            <span
              className="td-catmgr__preview-badge"
              style={{ background: color + "18", color }}
            >
              {emoji} {name || "Aperçu"}
            </span>
          </div>

          {/* Row 2: emoji grid (compact) */}
          <div className="td-catmgr__emoji-grid">
            {EMOJI_SUGGESTIONS.map((e) => (
              <button
                key={e}
                type="button"
                className={`td-catmgr__emoji-btn ${emoji === e ? "td-catmgr__emoji-btn--active" : ""}`}
                onClick={() => setEmoji(e)}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Row 3: color palette inline */}
          <div className="td-catmgr__color-row">
            <div className="td-catmgr__color-grid">
              {COLOR_PALETTE.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`td-catmgr__color-btn ${color === c ? "td-catmgr__color-btn--active" : ""}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                >
                  {color === c && <Check size={10} color="#fff" />}
                </button>
              ))}
              <input
                className="td-catmgr__color-custom"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                title="Couleur personnalisée"
              />
            </div>
          </div>

          {/* Row 4: actions */}
          <div className="td-catmgr__actions">
            <button className="td-catmgr__cancel" onClick={resetForm}>
              <X size={12} /> Annuler
            </button>
            <button
              className="td-catmgr__save"
              onClick={editingId ? handleEdit : handleAdd}
              disabled={!name.trim()}
            >
              <Check size={12} /> {editingId ? "Modifier" : "Créer"}
            </button>
          </div>
        </div>
      )}

      {categories.length === 0 && !isFormOpen && (
        <p className="td-catmgr__empty">Aucune catégorie pour l'instant.</p>
      )}
    </div>
  );
}
