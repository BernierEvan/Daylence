import { useBudgetStore } from "../store/budgetStore";
import { CATEGORY_META } from "../types";
import type { Category } from "../types";
import { useAnonymousFormat } from "../hooks/useBudget";

export default function BudgetChart() {
  const envelopes = useBudgetStore((s) => s.envelopes);
  const getCategorySpent = useBudgetStore((s) => s.getCategorySpent);
  const { fmt } = useAnonymousFormat();

  const sorted = [...envelopes].sort((a, b) => a.priority - b.priority);

  if (sorted.length === 0) {
    return (
      <div className="bc-empty">
        <p>Aucune enveloppe ce mois-ci</p>
      </div>
    );
  }

  const max = Math.max(
    ...sorted.map((e) => Math.max(e.target, getCategorySpent(e.category))),
    1,
  );

  return (
    <div className="bc-chart">
      <h3 className="bc-chart__title">Enveloppes — Budget vs Dépensé</h3>
      <div className="bc-legend">
        <span className="bc-legend__item">
          <span className="bc-legend__dot bc-legend__dot--target" /> Budget
        </span>
        <span className="bc-legend__item">
          <span className="bc-legend__dot bc-legend__dot--spent" /> Dépensé
        </span>
      </div>
      <div className="bc-bars">
        {sorted.map((env) => {
          const meta = CATEGORY_META[env.category as Category];
          const spent = getCategorySpent(env.category);
          const pctTarget = Math.round((env.target / max) * 100);
          const pctSpent = Math.round((spent / max) * 100);
          const over = spent > env.target;

          return (
            <div className="bc-bar-row" key={env.category}>
              <span className="bc-bar-row__emoji">{meta.emoji}</span>
              <span className="bc-bar-row__label">{meta.label}</span>
              <div className="bc-bar-row__tracks">
                {/* Target bar (dimmed) */}
                <div className="bc-bar-row__track">
                  <div
                    className="bc-bar-row__fill bc-bar-row__fill--target"
                    style={{
                      width: `${pctTarget}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
                {/* Spent bar */}
                <div className="bc-bar-row__track">
                  <div
                    className={`bc-bar-row__fill bc-bar-row__fill--spent ${over ? "bc-bar-row__fill--over" : ""}`}
                    style={{
                      width: `${pctSpent}%`,
                      backgroundColor: over ? undefined : meta.color,
                    }}
                  />
                </div>
              </div>
              <div className="bc-bar-row__amounts">
                <span className="bc-bar-row__amount">{fmt(spent)}</span>
                <span className="bc-bar-row__target">/ {fmt(env.target)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
