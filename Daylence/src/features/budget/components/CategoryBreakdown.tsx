import { Shield, Zap } from "lucide-react";
import { useBudgetStore } from "../store/budgetStore";
import { CATEGORY_META } from "../types";
import type { Category } from "../types";

export default function CategoryBreakdown() {
  const envelopes = useBudgetStore((s) => s.envelopes);
  const getCategorySpent = useBudgetStore((s) => s.getCategorySpent);

  const sorted = [...envelopes].sort((a, b) => a.priority - b.priority);

  if (sorted.length === 0) {
    return (
      <div className="cb-empty">
        <p>Aucune enveloppe définie</p>
      </div>
    );
  }

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  return (
    <div className="cb-section">
      <h3 className="cb-section__title">Enveloppes budgétaires</h3>
      <div className="cb-list">
        {sorted.map((env) => {
          const meta = CATEGORY_META[env.category as Category];
          const spent = getCategorySpent(env.category);
          const allocated = env.allocated;
          const pctAllocated =
            env.target > 0
              ? Math.min(Math.round((allocated / env.target) * 100), 100)
              : 0;
          const pctSpent =
            allocated > 0
              ? Math.min(Math.round((spent / allocated) * 100), 100)
              : 0;
          const over = spent > allocated && allocated > 0;

          return (
            <div
              className={`cb-item ${over ? "cb-item--over" : ""}`}
              key={env.category}
            >
              <div className="cb-item__header">
                <span className="cb-item__cat">
                  {meta.emoji} {meta.label}
                  {env.isEssential && (
                    <Shield size={12} className="cb-item__essential" />
                  )}
                </span>
                <span className="cb-item__priority">
                  <Zap size={10} /> P{env.priority}
                </span>
              </div>

              {/* Allocation bar */}
              <div className="cb-item__row">
                <span className="cb-item__sublabel">Alloué</span>
                <div className="cb-item__track">
                  <div
                    className="cb-item__fill cb-item__fill--alloc"
                    style={{
                      width: `${pctAllocated}%`,
                      backgroundColor: meta.color,
                      opacity: 0.5,
                    }}
                  />
                </div>
                <span className="cb-item__values">
                  {fmt(allocated)} / {fmt(env.target)}
                </span>
              </div>

              {/* Spent bar */}
              <div className="cb-item__row">
                <span className="cb-item__sublabel">Dépensé</span>
                <div className="cb-item__track">
                  <div
                    className="cb-item__fill"
                    style={{
                      width: `${pctSpent}%`,
                      backgroundColor: over ? "#ef4444" : meta.color,
                    }}
                  />
                </div>
                <span
                  className={`cb-item__values ${over ? "cb-item__values--over" : ""}`}
                >
                  {fmt(spent)} / {fmt(allocated)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
