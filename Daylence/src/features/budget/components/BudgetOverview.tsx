import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  ArrowDownToLine,
  AlertTriangle,
} from "lucide-react";
import { useBudgetStore } from "../store/budgetStore";

export default function BudgetOverview() {
  const getMonthSummary = useBudgetStore((s) => s.getMonthSummary);
  const getAllocation = useBudgetStore((s) => s.getAllocation);
  const summary = getMonthSummary();
  const allocation = getAllocation();

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
      label: "Distribué",
      amount: allocation.totalDistributed,
      icon: <ArrowDownToLine size={20} />,
      cls: "bo-card--distributed",
    },
    {
      label: "Restant",
      amount: allocation.remaining,
      icon: <PiggyBank size={20} />,
      cls: "bo-card--savings",
    },
  ];

  return (
    <div className="bo-section">
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
      {allocation.deficit > 0 && (
        <div className="bo-alert">
          <AlertTriangle size={16} />
          <span>
            Déficit de {fmt(allocation.deficit)} —{" "}
            {allocation.unfundedCategories.length} enveloppe
            {allocation.unfundedCategories.length > 1 ? "s" : ""} sous-financée
            {allocation.unfundedCategories.length > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
