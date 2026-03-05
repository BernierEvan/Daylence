import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { useBudgetStore } from "../store/budgetStore";

export default function BudgetOverview() {
  const summary = useBudgetStore((s) => s.getMonthSummary());

  const fmt = (n: number) =>
    n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

  const cards = [
    {
      label: "Revenus",
      amount: summary.totalIncome,
      icon: <TrendingUp size={20} />,
      cls: "bo-card--income",
    },
    {
      label: "Dépenses",
      amount: summary.totalExpenses,
      icon: <TrendingDown size={20} />,
      cls: "bo-card--expense",
    },
    {
      label: "Solde",
      amount: summary.balance,
      icon: <Wallet size={20} />,
      cls: summary.balance >= 0 ? "bo-card--positive" : "bo-card--negative",
    },
    {
      label: "Épargne",
      amount: summary.byCategory.epargne || 0,
      icon: <PiggyBank size={20} />,
      cls: "bo-card--savings",
    },
  ];

  return (
    <div className="bo-grid">
      {cards.map((c) => (
        <div key={c.label} className={`bo-card ${c.cls}`}>
          <div className="bo-card__icon">{c.icon}</div>
          <div className="bo-card__info">
            <span className="bo-card__label">{c.label}</span>
            <span className="bo-card__amount">{fmt(c.amount)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
