import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Check, Trash2, X } from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import { AISLES, type Aisle } from "../types";

export default function GroceryList() {
  const items = useTodoStore((s) => s.groceryItems);
  const addItem = useTodoStore((s) => s.addGroceryItem);
  const toggle = useTodoStore((s) => s.toggleGroceryItem);
  const remove = useTodoStore((s) => s.removeGroceryItem);
  const clearChecked = useTodoStore((s) => s.clearCheckedGrocery);

  const [name, setName] = useState("");
  const [aisle, setAisle] = useState<Aisle>("Épicerie");

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addItem(trimmed, aisle);
    setName("");
  };

  // Group by aisle
  const grouped = AISLES.reduce<Record<string, typeof items>>((acc, a) => {
    const list = items.filter((i) => i.aisle === a);
    if (list.length > 0) acc[a] = list;
    return acc;
  }, {});

  const unchecked = items.filter((i) => !i.checked).length;
  const total = items
    .filter((i) => !i.checked)
    .reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);

  return (
    <div className="td-grocery">
      <div className="td-section__header">
        <h2 className="td-section__title">Liste de courses</h2>
        {items.some((i) => i.checked) && (
          <button className="td-btn--text" onClick={clearChecked}>
            <X size={14} /> Vider cochés
          </button>
        )}
      </div>

      <div className="td-grocery__meta">
        <span>
          {unchecked} article{unchecked !== 1 ? "s" : ""} restant
          {unchecked !== 1 ? "s" : ""}
        </span>
        {total > 0 && (
          <span className="td-grocery__total">≈ {total.toFixed(2)} €</span>
        )}
      </div>

      {/* add form */}
      <form className="td-grocery__form" onSubmit={handleAdd}>
        <input
          className="td-form__input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ajouter un article…"
        />
        <select
          className="td-grocery__select"
          value={aisle}
          onChange={(e) => setAisle(e.target.value as Aisle)}
        >
          {AISLES.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
        <button className="td-form__btn" type="submit" aria-label="Ajouter">
          <Plus size={18} />
        </button>
      </form>

      {/* aisles */}
      <div className="td-grocery__aisles">
        {Object.entries(grouped).map(([aisleName, list]) => (
          <div key={aisleName} className="td-aisle">
            <h3 className="td-aisle__title">{aisleName}</h3>
            <AnimatePresence mode="popLayout">
              {list.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className={`td-grocery__item ${item.checked ? "td-grocery__item--checked" : ""}`}
                >
                  <button
                    className="td-item__check"
                    onClick={() => toggle(item.id)}
                    aria-label={item.checked ? "Décocher" : "Cocher"}
                  >
                    {item.checked ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      <span className="td-item__circle" />
                    )}
                  </button>
                  <span className="td-grocery__name">{item.name}</span>
                  <span className="td-grocery__qty">
                    {item.quantity} {item.unit}
                  </span>
                  {item.price != null && (
                    <span className="td-grocery__price">
                      {(item.price * item.quantity).toFixed(2)} €
                    </span>
                  )}
                  <button
                    className="td-item__delete"
                    onClick={() => remove(item.id)}
                    aria-label="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
