import { useState, useCallback } from "react";
import { Plus, X, Sparkles } from "lucide-react";
import { useBudgetStore } from "../store/budgetStore";
import {
  CATEGORY_META,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  smartCategorize,
} from "../types";
import type { TransactionType, Category } from "../types";

export default function ExpenseForm() {
  const addTransaction = useBudgetStore((s) => s.addTransaction);
  const [open, setOpen] = useState(false);

  const [type, setType] = useState<TransactionType>("expense");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("alimentation");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [autoDetected, setAutoDetected] = useState(false);

  const cats = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const reset = () => {
    setLabel("");
    setAmount("");
    setCategory(type === "expense" ? "alimentation" : "salaire");
    setDate(new Date().toISOString().slice(0, 10));
    setNote("");
    setAutoDetected(false);
  };

  // Smart auto-categorize on label change
  const handleLabelChange = useCallback((value: string) => {
    setLabel(value);
    if (value.length >= 3) {
      const detected = smartCategorize(value);
      if (detected) {
        setCategory(detected);
        setAutoDetected(true);
        // Auto-detect type from category
        if (detected === "salaire" || detected === "freelance") {
          setType("income");
        }
        return;
      }
    }
    setAutoDetected(false);
  }, []);

  const handleTypeSwitch = (newType: TransactionType) => {
    setType(newType);
    if (!autoDetected) {
      setCategory(newType === "expense" ? "alimentation" : "salaire");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !amount) return;
    addTransaction({
      type,
      label: label.trim(),
      amount: parseFloat(amount),
      category,
      date,
      note: note.trim() || undefined,
    });
    reset();
    setOpen(false);
  };

  return (
    <>
      <button
        className="ef-fab"
        onClick={() => setOpen(true)}
        title="Ajouter une transaction"
      >
        <Plus size={22} />
      </button>

      {open && (
        <div className="ef-overlay" onClick={() => setOpen(false)}>
          <div className="ef-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ef-modal__header">
              <h3>Nouvelle transaction</h3>
              <button
                className="ef-modal__close"
                onClick={() => setOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form className="ef-form" onSubmit={handleSubmit}>
              {/* Type toggle */}
              <div className="ef-toggle">
                <button
                  type="button"
                  className={`ef-toggle__btn ${type === "expense" ? "ef-toggle__btn--active ef-toggle__btn--expense" : ""}`}
                  onClick={() => handleTypeSwitch("expense")}
                >
                  Dépense
                </button>
                <button
                  type="button"
                  className={`ef-toggle__btn ${type === "income" ? "ef-toggle__btn--active ef-toggle__btn--income" : ""}`}
                  onClick={() => handleTypeSwitch("income")}
                >
                  Revenu
                </button>
              </div>

              <div className="ef-field">
                <label>Libellé</label>
                <input
                  type="text"
                  value={label}
                  onChange={(e) => handleLabelChange(e.target.value)}
                  placeholder="Ex: Courses Carrefour"
                  required
                />
                {autoDetected && (
                  <span className="ef-auto-badge">
                    <Sparkles size={12} /> Auto-détecté :{" "}
                    {CATEGORY_META[category].emoji}{" "}
                    {CATEGORY_META[category].label}
                  </span>
                )}
              </div>

              <div className="ef-row">
                <div className="ef-field ef-field--half">
                  <label>Montant (€)</label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="ef-field ef-field--half">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="ef-field">
                <label>Catégorie</label>
                <div className="ef-cats">
                  {cats.map((c) => {
                    const meta = CATEGORY_META[c];
                    return (
                      <button
                        type="button"
                        key={c}
                        className={`ef-cat ${category === c ? "ef-cat--active" : ""}`}
                        style={
                          category === c
                            ? { backgroundColor: meta.color, color: "#fff" }
                            : {}
                        }
                        onClick={() => {
                          setCategory(c);
                          setAutoDetected(false);
                        }}
                      >
                        {meta.emoji} {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ef-field">
                <label>Note (optionnel)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Détails supplémentaires..."
                />
              </div>

              <button type="submit" className="ef-submit">
                {type === "expense"
                  ? "Ajouter la dépense"
                  : "Ajouter le revenu"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
