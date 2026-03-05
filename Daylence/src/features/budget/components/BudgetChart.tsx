import { useBudgetStore } from "../store/budgetStore";
import { CATEGORY_META } from "../types";
import type { Category } from "../types";

export default function BudgetChart() {
  const summary = useBudgetStore((s) => s.getMonthSummary());

  // Only show expense categories that have spending
  const entries = Object.entries(summary.byCategory)
    .filter(([cat]) => {
      const meta = CATEGORY_META[cat as Category];
      return meta && cat !== "salaire" && cat !== "freelance";
    })
    .sort(([, a], [, b]) => b - a);

  const max = entries.length > 0 ? entries[0][1] : 1;

  if (entries.length === 0) {
    return (
      <div className="bc-empty">
        <p>Aucune dépense ce mois‑ci</p>
      </div>
    );
  }

  return (
    <div className="bc-chart">
      <h3 className="bc-chart__title">Répartition des dépenses</h3>
      <div className="bc-bars">
        {entries.map(([cat, amount]) => {
          const meta = CATEGORY_META[cat as Category];
          const pct = Math.round((amount / max) * 100);
          return (
            <div className="bc-bar-row" key={cat}>
              <span className="bc-bar-row__emoji">{meta.emoji}</span>
              <span className="bc-bar-row__label">{meta.label}</span>
              <div className="bc-bar-row__track">
                <div
                  className="bc-bar-row__fill"
                  style={{ width: `${pct}%`, backgroundColor: meta.color }}
                />
              </div>
              <span className="bc-bar-row__amount">
                {amount.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
