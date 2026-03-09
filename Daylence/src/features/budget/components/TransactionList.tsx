import { Trash2 } from "lucide-react";
import { useBudgetStore } from "../store/budgetStore";
import { CATEGORY_META } from "../types";
import type { Transaction, Category } from "../types";

interface Props {
  transactions: Transaction[];
  showAll?: boolean;
}

export default function TransactionList({ transactions, showAll }: Props) {
  const removeTransaction = useBudgetStore((s) => s.removeTransaction);

  if (transactions.length === 0) {
    return (
      <div className="tl-empty">
        <p>Aucune transaction</p>
      </div>
    );
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };

  return (
    <div className="tl-list">
      {transactions.map((tx) => {
        const meta = CATEGORY_META[tx.category as Category];
        const isIncome = tx.type === "income";
        return (
          <div className="tl-item" key={tx.id}>
            <div
              className="tl-item__icon"
              style={{ backgroundColor: meta.color + "1a", color: meta.color }}
            >
              {meta.emoji}
            </div>
            <div className="tl-item__info">
              <span className="tl-item__label">{tx.label}</span>
              <span className="tl-item__sub">
                {meta.label} · {formatDate(tx.date)}
              </span>
            </div>
            <span
              className={`tl-item__amount ${isIncome ? "tl-item__amount--income" : "tl-item__amount--expense"}`}
            >
              {isIncome ? "+" : "−"}
              {tx.amount.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </span>
            {showAll && (
              <button
                className="tl-item__del"
                onClick={() => removeTransaction(tx.id)}
                title="Supprimer"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
