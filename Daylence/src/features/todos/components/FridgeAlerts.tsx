import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Palette,
} from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import { COLOR_PALETTE } from "../types";

function daysUntil(dateStr: string) {
  return Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
}

function urgencyClass(days: number) {
  if (days <= 0) return "td-fridge__row--expired";
  if (days <= 1) return "td-fridge__row--urgent";
  if (days <= 3) return "td-fridge__row--soon";
  return "";
}

function urgencyLabel(days: number) {
  if (days <= 0) return "Périmé";
  if (days === 1) return "Demain";
  return `${days} j`;
}

export default function FridgeAlerts() {
  const items = useTodoStore((s) => s.fridgeItems);
  const addItem = useTodoStore((s) => s.addFridgeItem);
  const toggle = useTodoStore((s) => s.toggleFridgeConsumed);
  const remove = useTodoStore((s) => s.removeFridgeItem);
  const updateColor = useTodoStore((s) => s.updateFridgeColor);

  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);

  const FRIDGE_COLORS = ["#ffffff", "#dfe6e9", ...COLOR_PALETTE];

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !expiry) return;
    addItem(trimmed, expiry);
    setName("");
    setExpiry("");
  };

  // Sort: unconsumed first, by expiry ascending
  const sorted = [...items]
    .filter((i) => !i.consumed)
    .sort(
      (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    );

  const consumed = items.filter((i) => i.consumed);

  return (
    <div className="td-fridge">
      <h2 className="td-section__title">Sommet du frigo</h2>

      {/* add form */}
      <form className="td-fridge__form" onSubmit={handleAdd}>
        <input
          className="td-form__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Produit…"
        />
        <input
          className="td-form__input td-fridge__date"
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
        <button className="td-form__btn" type="submit" aria-label="Ajouter">
          <Plus size={18} />
        </button>
      </form>

      {/* expiring items */}
      <div className="td-fridge__list">
        <AnimatePresence mode="popLayout">
          {sorted.map((item) => {
            const days = daysUntil(item.expiryDate);
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`td-fridge__row ${urgencyClass(days)}`}
                style={
                  item.color && item.color !== "#ffffff"
                    ? {
                        borderColor: item.color,
                        background: `${item.color}18`,
                      }
                    : undefined
                }
              >
                <div className="td-fridge__info">
                  {days <= 1 && (
                    <AlertTriangle size={14} className="td-fridge__warn" />
                  )}
                  <span className="td-fridge__name">{item.name}</span>
                  <span className="td-fridge__qty">{item.quantity}</span>
                </div>
                <span className="td-fridge__badge">{urgencyLabel(days)}</span>
                <div className="td-fridge__actions">
                  <button
                    className="td-btn--icon"
                    onClick={() =>
                      setPickerOpen(pickerOpen === item.id ? null : item.id)
                    }
                    aria-label="Couleur"
                  >
                    <Palette size={14} />
                  </button>
                  <button
                    className="td-btn--icon"
                    onClick={() => toggle(item.id)}
                    aria-label="Consommé"
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    className="td-btn--icon"
                    onClick={() => remove(item.id)}
                    aria-label="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {pickerOpen === item.id && (
                  <div className="td-color-picker td-color-picker--row">
                    {FRIDGE_COLORS.map((c) => (
                      <button
                        key={c}
                        className={`td-color-picker__dot${c === item.color ? " td-color-picker__dot--active" : ""}`}
                        style={{ background: c }}
                        onClick={() => {
                          updateColor(item.id, c);
                          setPickerOpen(null);
                        }}
                        aria-label={c}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        {sorted.length === 0 && (
          <p className="td-empty">Aucun produit à surveiller 👍</p>
        )}
      </div>

      {consumed.length > 0 && (
        <details className="td-fridge__consumed">
          <summary>
            {consumed.length} consommé{consumed.length > 1 ? "s" : ""}
          </summary>
          {consumed.map((c) => (
            <div key={c.id} className="td-fridge__row td-fridge__row--consumed">
              <span>{c.name}</span>
              <button
                className="td-btn--icon"
                onClick={() => remove(c.id)}
                aria-label="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </details>
      )}
    </div>
  );
}
