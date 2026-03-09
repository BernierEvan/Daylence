import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import BudgetOverview from "../components/BudgetOverview";
import BudgetChart from "../components/BudgetChart";
import CategoryBreakdown from "../components/CategoryBreakdown";
import TransactionList from "../components/TransactionList";
import ExpenseForm from "../components/ExpenseForm";
import { useBudgetStore } from "../store/budgetStore";
import "../css/BudgetPage.css";

const MONTH_LABELS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

export default function BudgetPage() {
  const selectedMonth = useBudgetStore((s) => s.selectedMonth);
  const setSelectedMonth = useBudgetStore((s) => s.setSelectedMonth);
  const recentTxs = useBudgetStore((s) => s.getRecentTransactions(6));

  const [year, month] = selectedMonth.split("-").map(Number);
  const monthLabel = `${MONTH_LABELS[month - 1]} ${year}`;

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${d.getFullYear()}-${m}`);
  };

  const [tab, setTab] = useState<"overview" | "transactions">("overview");

  return (
    <div className="bp-page">
      {/* ── Header ── */}
      <header className="bp-header">
        <a href="/" className="bp-header__brand">
          <img src="/daylence_logo_without_title.png" alt="Daylence" className="bp-header__logo" />
          <span className="bp-header__title">Daylence</span>
        </a>
        <nav className="bp-header__nav">
          <a href="/" className="bp-header__link">Accueil</a>
          <a href="/discover" className="bp-header__link">Découvrir</a>
          <a href="/support" className="bp-header__link">Support</a>
        </nav>
      </header>

      {/* ── Sub‑header ── */}
      <div className="bp-subheader">
        <a href="/" className="bp-back">
          <ArrowLeft size={18} /> Retour
        </a>
        <div className="bp-month-picker">
          <button onClick={() => shiftMonth(-1)} className="bp-month-picker__btn">
            <ChevronLeft size={18} />
          </button>
          <span className="bp-month-picker__label">{monthLabel}</span>
          <button onClick={() => shiftMonth(1)} className="bp-month-picker__btn">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* ── Tab nav ── */}
      <div className="bp-tabs">
        <button
          className={`bp-tabs__btn ${tab === "overview" ? "bp-tabs__btn--active" : ""}`}
          onClick={() => setTab("overview")}
        >
          Vue d'ensemble
        </button>
        <button
          className={`bp-tabs__btn ${tab === "transactions" ? "bp-tabs__btn--active" : ""}`}
          onClick={() => setTab("transactions")}
        >
          Transactions
        </button>
      </div>

      {/* ── Content ── */}
      <main className="bp-content">
        {tab === "overview" ? (
          <>
            <BudgetOverview />
            <div className="bp-columns">
              <BudgetChart />
              <CategoryBreakdown />
            </div>
            <section className="bp-recent">
              <h3 className="bp-recent__title">Transactions récentes</h3>
              <TransactionList transactions={recentTxs} />
            </section>
          </>
        ) : (
          <TransactionsView />
        )}
      </main>

      {/* ── FAB ── */}
      <ExpenseForm />

      {/* ── Footer ── */}
      <footer className="bp-footer">
        <div className="bp-footer__inner">
          <span className="bp-footer__copy">&copy; {new Date().getFullYear()} Daylence</span>
          <div className="bp-footer__links">
            <a href="/privacy-policy">Confidentialité</a>
            <a href="/support">Aide</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Inline Transactions sub‑view ── */
function TransactionsView() {
  const allTxs = useBudgetStore((s) => s.getMonthTransactions());
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all");

  const filtered =
    filter === "all" ? allTxs : allTxs.filter((t) => t.type === filter);

  return (
    <div className="bp-txview">
      <div className="bp-txview__filters">
        {(["all", "expense", "income"] as const).map((f) => (
          <button
            key={f}
            className={`bp-txview__fbtn ${filter === f ? "bp-txview__fbtn--active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "Tout" : f === "expense" ? "Dépenses" : "Revenus"}
          </button>
        ))}
      </div>
      <TransactionList transactions={filtered} showAll />
    </div>
  );
}
