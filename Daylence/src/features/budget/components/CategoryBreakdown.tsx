import { useBudgetStore } from "../store/budgetStore";
import { CATEGORY_META } from "../types";
import type { Category } from "../types";

export default function CategoryBreakdown() {
  const goals = useBudgetStore((s) => s.goals);
  const getCategorySpent = useBudgetStore((s) => s.getCategorySpent);

  if (goals.length === 0) {
    return (
      <div className="cb-empty">
        <p>Aucun objectif défini</p>
      </div>
    );
  }

  return (
    <div className="cb-section">
      <h3 className="cb-section__title">Objectifs budgétaires</h3>
      <div className="cb-list">
        {goals.map((goal) => {
          const meta = CATEGORY_META[goal.category as Category];
          const spent = getCategorySpent(goal.category);
          const pct = Math.min(Math.round((spent / goal.limit) * 100), 100);
          const over = spent > goal.limit;

          return (
            <div
              className={`cb-item ${over ? "cb-item--over" : ""}`}
              key={goal.category}
            >
              <div className="cb-item__header">
                <span className="cb-item__cat">
                  {meta.emoji} {meta.label}
                </span>
                <span className="cb-item__values">
                  {spent.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                  {" / "}
                  {goal.limit.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </span>
              </div>
              <div className="cb-item__track">
                <div
                  className="cb-item__fill"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: over ? "#ef4444" : meta.color,
                  }}
                />
              </div>
              <span className="cb-item__pct">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
