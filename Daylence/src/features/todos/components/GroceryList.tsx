import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Check,
  Trash2,
  X,
  ArrowLeft,
  ShoppingCart,
  Pencil,
} from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import {
  AISLES,
  AISLE_COLORS,
  type Aisle,
  type GroceryList as GroceryListType,
} from "../types";
import { fmtDateShort } from "../../../lib/utils";

/* ═══════════════════════════════════════
   List-detail view (items inside a list)
   ═══════════════════════════════════════ */
function ListDetail({
  list,
  onBack,
}: {
  list: GroceryListType;
  onBack: () => void;
}) {
  const addItem = useTodoStore((s) => s.addGroceryItem);
  const toggle = useTodoStore((s) => s.toggleGroceryItem);
  const remove = useTodoStore((s) => s.removeGroceryItem);
  const clearChecked = useTodoStore((s) => s.clearCheckedGrocery);
  const rename = useTodoStore((s) => s.renameGroceryList);

  const [name, setName] = useState("");
  const [aisle, setAisle] = useState<Aisle>("Épicerie");
  const [editing, setEditing] = useState(false);
  const [listName, setListName] = useState(list.name);

  const items = list.items;

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addItem(list.id, trimmed, aisle);
    setName("");
  };

  const handleRename = () => {
    const trimmed = listName.trim();
    if (trimmed && trimmed !== list.name) rename(list.id, trimmed);
    setEditing(false);
  };

  const grouped = AISLES.reduce<Record<string, typeof items>>((acc, a) => {
    const filtered = items.filter((i) => i.aisle === a);
    if (filtered.length > 0) acc[a] = filtered;
    return acc;
  }, {});

  const unchecked = items.filter((i) => !i.checked).length;
  const total = items
    .filter((i) => !i.checked)
    .reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0);

  return (
    <div className="td-grocery">
      {/* back + title */}
      <div className="td-section__header">
        <div className="td-grocery__back-row">
          <button className="td-btn--icon" onClick={onBack} aria-label="Retour">
            <ArrowLeft size={18} />
          </button>
          {editing ? (
            <input
              className="td-form__input td-form__input--sm td-grocery__rename"
              autoFocus
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
            />
          ) : (
            <h2
              className="td-section__title td-section__title--clickable"
              onClick={() => setEditing(true)}
            >
              {list.name}
              <Pencil size={12} className="td-grocery__edit-icon" />
            </h2>
          )}
        </div>
        {items.some((i) => i.checked) && (
          <button
            className="td-btn--text"
            onClick={() => clearChecked(list.id)}
          >
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
        {Object.entries(grouped).map(([aisleName, aisleItems]) => {
          const aisleColor = AISLE_COLORS[aisleName as Aisle] ?? "#636e72";
          return (
            <div key={aisleName} className="td-aisle">
              <h3 className="td-aisle__title" style={{ color: aisleColor }}>
                <span
                  className="td-aisle__dot"
                  style={{ background: aisleColor }}
                />
                {aisleName}
              </h3>
              <AnimatePresence mode="popLayout">
                {aisleItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    className={`td-grocery__item ${item.checked ? "td-grocery__item--checked" : ""}`}
                    style={{ borderLeftColor: aisleColor, borderLeftWidth: 3 }}
                  >
                    <button
                      className="td-item__check"
                      onClick={() => toggle(list.id, item.id)}
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
                      onClick={() => remove(list.id, item.id)}
                      aria-label="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {items.length === 0 && (
        <p className="td-empty">Aucun article — ajoutez-en !</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   Main component — list-of-lists + detail
   ═══════════════════════════════════════ */
export default function GroceryList() {
  const lists = useTodoStore((s) => s.groceryLists);
  const activeId = useTodoStore((s) => s.activeGroceryListId);
  const setActiveId = useTodoStore((s) => s.setActiveGroceryListId);
  const addList = useTodoStore((s) => s.addGroceryList);
  const removeList = useTodoStore((s) => s.removeGroceryList);

  const [newName, setNewName] = useState("");

  const activeList = lists.find((l) => l.id === activeId);

  /* detail view */
  if (activeList) {
    return <ListDetail list={activeList} onBack={() => setActiveId(null)} />;
  }

  /* list-of-lists view */
  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    addList(trimmed);
    setNewName("");
  };

  return (
    <div className="td-grocery">
      <h2 className="td-section__title">Mes listes de courses</h2>

      {/* create list */}
      <form className="td-grocery__form" onSubmit={handleCreate}>
        <input
          className="td-form__input"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Nouvelle liste…"
        />
        <button
          className="td-form__btn"
          type="submit"
          aria-label="Créer la liste"
        >
          <Plus size={18} />
        </button>
      </form>

      {/* list cards */}
      <div className="td-grocery__lists">
        <AnimatePresence mode="popLayout">
          {lists.map((list) => {
            const unchecked = list.items.filter((i) => !i.checked).length;
            const total = list.items.length;
            const checked = total - unchecked;
            const pct = total > 0 ? Math.round((checked / total) * 100) : 0;
            return (
              <motion.div
                key={list.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="td-grocery__list-card"
                onClick={() => setActiveId(list.id)}
              >
                <div className="td-grocery__list-icon">
                  <ShoppingCart size={20} />
                </div>
                <div className="td-grocery__list-info">
                  <span className="td-grocery__list-name">{list.name}</span>
                  <span className="td-grocery__list-meta">
                    {total} article{total !== 1 ? "s" : ""} · Créée le{" "}
                    {fmtDateShort(new Date(list.createdAt))}
                  </span>
                </div>
                <div className="td-grocery__list-progress">
                  <div className="td-grocery__list-bar">
                    <div
                      className="td-grocery__list-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="td-grocery__list-pct">{pct}%</span>
                </div>
                <button
                  className="td-item__delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeList(list.id);
                  }}
                  aria-label="Supprimer la liste"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {lists.length === 0 && (
        <p className="td-empty">Aucune liste — créez-en une !</p>
      )}
    </div>
  );
}
