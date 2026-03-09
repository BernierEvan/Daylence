import { useState } from "react";
import { Plus, Trash2, GripVertical, Shield, ShieldOff } from "lucide-react";
import { useBudgetStore } from "../store/budgetStore";
import { CATEGORY_META, EXPENSE_CATEGORIES } from "../types";
import type { Category } from "../types";

export default function EnvelopeManager() {
  const envelopes = useBudgetStore((s) => s.envelopes);
  const setEnvelope = useBudgetStore((s) => s.setEnvelope);
  const removeEnvelope = useBudgetStore((s) => s.removeEnvelope);

  const sorted = [...envelopes].sort((a, b) => a.priority - b.priority);

  // New envelope form
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState<Category>("autre");
  const [newTarget, setNewTarget] = useState("");
  const [newEssential, setNewEssential] = useState(false);

  const usedCategories = new Set(envelopes.map((e) => e.category));
  const availableCategories = EXPENSE_CATEGORIES.filter(
    (c) => !usedCategories.has(c),
  );

  const handleAdd = () => {
    if (!newTarget || !newCat) return;
    const maxPriority =
      envelopes.length > 0 ? Math.max(...envelopes.map((e) => e.priority)) : 0;
    setEnvelope(newCat, parseFloat(newTarget), maxPriority + 1, newEssential);
    setNewTarget("");
    setNewEssential(false);
    setAdding(false);
  };

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  const handlePriorityChange = (category: Category, newPriority: number) => {
    const env = envelopes.find((e) => e.category === category);
    if (env) {
      setEnvelope(category, env.target, newPriority, env.isEssential);
    }
  };

  const handleTargetChange = (category: Category, newTarget: number) => {
    const env = envelopes.find((e) => e.category === category);
    if (env) {
      setEnvelope(category, newTarget, env.priority, env.isEssential);
    }
  };

  const toggleEssential = (category: Category) => {
    const env = envelopes.find((e) => e.category === category);
    if (env) {
      setEnvelope(category, env.target, env.priority, !env.isEssential);
    }
  };

  return (
    <div className="em-section">
      <div className="em-header">
        <h3 className="em-header__title">Gestion des enveloppes</h3>
        <span className="em-header__count">{envelopes.length} envelopes</span>
      </div>

      <div className="em-list">
        {sorted.map((env) => {
          const meta = CATEGORY_META[env.category];
          return (
            <div className="em-item" key={env.category}>
              <div className="em-item__grip">
                <GripVertical size={14} />
              </div>
              <div className="em-item__priority">
                <label>P</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={env.priority}
                  onChange={(e) =>
                    handlePriorityChange(
                      env.category,
                      parseInt(e.target.value) || 1,
                    )
                  }
                  className="em-item__prio-input"
                />
              </div>
              <div className="em-item__cat">
                <span className="em-item__emoji">{meta.emoji}</span>
                <span className="em-item__label">{meta.label}</span>
              </div>
              <div className="em-item__target">
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={env.target}
                  onChange={(e) =>
                    handleTargetChange(
                      env.category,
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  className="em-item__target-input"
                />
                <span className="em-item__currency">€</span>
              </div>
              <div className="em-item__alloc">
                <span className="em-item__alloc-value">
                  {fmt(env.allocated)}
                </span>
                <span className="em-item__alloc-label">alloué</span>
              </div>
              <button
                className={`em-item__essential ${env.isEssential ? "em-item__essential--active" : ""}`}
                onClick={() => toggleEssential(env.category)}
                title={env.isEssential ? "Essentiel" : "Non essentiel"}
              >
                {env.isEssential ? (
                  <Shield size={14} />
                ) : (
                  <ShieldOff size={14} />
                )}
              </button>
              <button
                className="em-item__delete"
                onClick={() => removeEnvelope(env.category)}
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {adding ? (
        <div className="em-add-form">
          <select
            value={newCat}
            onChange={(e) => setNewCat(e.target.value as Category)}
            className="em-add-form__select"
          >
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min={0}
            step={10}
            value={newTarget}
            onChange={(e) => setNewTarget(e.target.value)}
            placeholder="Budget €"
            className="em-add-form__input"
          />
          <label className="em-add-form__check">
            <input
              type="checkbox"
              checked={newEssential}
              onChange={(e) => setNewEssential(e.target.checked)}
            />
            Essentiel
          </label>
          <button className="em-add-form__ok" onClick={handleAdd}>
            Ajouter
          </button>
          <button
            className="em-add-form__cancel"
            onClick={() => setAdding(false)}
          >
            Annuler
          </button>
        </div>
      ) : (
        availableCategories.length > 0 && (
          <button className="em-add-btn" onClick={() => setAdding(true)}>
            <Plus size={16} /> Ajouter une enveloppe
          </button>
        )
      )}
    </div>
  );
}
