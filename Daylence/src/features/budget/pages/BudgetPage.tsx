import { useState, useRef } from "react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Download,
  Upload,
  Settings2,
} from "lucide-react";
import BudgetOverview from "../components/BudgetOverview";
import BudgetChart from "../components/BudgetChart";
import CategoryBreakdown from "../components/CategoryBreakdown";
import TransactionList from "../components/TransactionList";
import ExpenseForm from "../components/ExpenseForm";
import EnvelopeManager from "../components/EnvelopeManager";
import { useBudgetStore } from "../store/budgetStore";
import "../css/BudgetPage.css";

const MONTH_LABELS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function BudgetPage() {
  const selectedMonth = useBudgetStore((s) => s.selectedMonth);
  const setSelectedMonth = useBudgetStore((s) => s.setSelectedMonth);
  const getRecentTransactions = useBudgetStore((s) => s.getRecentTransactions);
  const recentTxs = getRecentTransactions(6);
  const runAllocation = useBudgetStore((s) => s.runAllocation);
  const validateMonth = useBudgetStore((s) => s.validateMonth);
  const allocationRun = useBudgetStore((s) => s.allocationRun);
  const exportData = useBudgetStore((s) => s.exportData);
  const importData = useBudgetStore((s) => s.importData);
  const getSnapshot = useBudgetStore((s) => s.getSnapshot);

  const [year, month] = selectedMonth.split("-").map(Number);
  const monthLabel = `${MONTH_LABELS[month - 1]} ${year}`;
  const snapshot = getSnapshot(selectedMonth);

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${d.getFullYear()}-${m}`);
  };

  const [tab, setTab] = useState<"overview" | "transactions" | "envelopes">(
    "overview",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daylence-budget-${selectedMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        importData(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="bp-page">
      {/* ── Header ── */}
      <header className="bp-header">
        <a href="/" className="bp-header__brand">
          <img
            src="/daylence_logo_without_title.png"
            alt="Daylence"
            className="bp-header__logo"
          />
          <span className="bp-header__title">Budget</span>
        </a>
        <div className="bp-header__actions">
          <button
            className="bp-header__action"
            onClick={handleExport}
            title="Exporter JSON"
          >
            <Download size={16} /> Exporter
          </button>
          <button
            className="bp-header__action"
            onClick={() => fileInputRef.current?.click()}
            title="Importer JSON"
          >
            <Upload size={16} /> Importer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </div>
      </header>

      {/* ── Sub-header ── */}
      <div className="bp-subheader">
        <a href="/" className="bp-back">
          <ArrowLeft size={18} /> Retour
        </a>
        <div className="bp-month-picker">
          <button
            onClick={() => shiftMonth(-1)}
            className="bp-month-picker__btn"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="bp-month-picker__label">{monthLabel}</span>
          <button
            onClick={() => shiftMonth(1)}
            className="bp-month-picker__btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="bp-subheader__right">
          {snapshot && (
            <span className="bp-validated-badge">
              <CheckCircle2 size={14} /> Validé
            </span>
          )}
          <button
            className="bp-alloc-btn"
            onClick={() => runAllocation()}
            title="Lancer l'allocation"
          >
            <Play size={14} /> Allouer
          </button>
          <button
            className="bp-validate-btn"
            onClick={() => validateMonth()}
            title="Valider le mois"
            disabled={!allocationRun}
          >
            <CheckCircle2 size={14} /> Valider
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
        <button
          className={`bp-tabs__btn ${tab === "envelopes" ? "bp-tabs__btn--active" : ""}`}
          onClick={() => setTab("envelopes")}
        >
          <Settings2 size={14} /> Enveloppes
        </button>
      </div>

      {/* ── Content ── */}
      <main className="bp-content">
        {tab === "overview" && (
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
        )}
        {tab === "transactions" && <TransactionsView />}
        {tab === "envelopes" && <EnvelopeManager />}
      </main>

      {/* ── FAB ── */}
      <ExpenseForm />

      {/* ── Footer ── */}
      <footer className="bp-footer">
        <div className="bp-footer__inner">
          <span className="bp-footer__copy">
            &copy; {new Date().getFullYear()} Daylence
          </span>
          <div className="bp-footer__links">
            <a href="/privacy-policy">Confidentialité</a>
            <a href="/support">Aide</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Inline Transactions sub-view ── */
function TransactionsView() {
  const getMonthTransactions = useBudgetStore((s) => s.getMonthTransactions);
  const allTxs = getMonthTransactions();
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
