import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle2,
  Download,
  Upload,
  Settings2,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import PageHeader from "../../../components/layout/PageHeader";
import BudgetOverview from "../components/BudgetOverview";
import TransactionList from "../components/TransactionList";
import ExpenseForm from "../components/ExpenseForm";
import EnvelopeManager from "../components/EnvelopeManager";
import { useBudgetStore } from "../store/budgetStore";
import { useAuth } from "../../auth/store/authStore";
import { usePreferences } from "../../settings/store/preferencesStore";
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
  const user = useAuth((s) => s.user);
  const init = useBudgetStore((s) => s.init);
  const loading = useBudgetStore((s) => s.loading);
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
  const anonymous = usePreferences((s) => s.budgetAnonymousMode);
  const setPreference = usePreferences((s) => s.set);
  const onboardingCompleted = useBudgetStore((s) => s.onboardingCompleted);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const [year, month] = selectedMonth.split("-").map(Number);
  const monthLabel = `${MONTH_LABELS[month - 1]} ${year}`;
  const snapshot = getSnapshot(selectedMonth);

  const shiftMonth = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(`${d.getFullYear()}-${m}`);
  };

  const [tab, setTab] = useState<
    "overview" | "transactions" | "envelopes" | "recurrences"
  >("overview");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id_user) init(user.id_user);
  }, [user?.id_user, init]);

  // Show onboarding wizard on first visit
  useEffect(() => {
    if (!loading && !onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [loading, onboardingCompleted]);

  if (loading) {
    return (
      <div className="bp-page">
        <PageHeader />
        <div className="bp-loading">
          <Loader2 size={28} className="bp-loading__spinner" />
          <span>Chargement du budget…</span>
        </div>
      </div>
    );
  }

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
      <PageHeader
        right={
          <>
            <button
              className={`ph__action ${anonymous ? "ph__action--active" : ""}`}
              onClick={() => setPreference("budgetAnonymousMode", !anonymous)}
              title={
                anonymous ? "Afficher les montants" : "Masquer les montants"
              }
            >
              {anonymous ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              className="ph__action"
              onClick={handleExport}
              title="Exporter JSON"
            >
              <Download size={16} /> Exporter
            </button>
            <button
              className="ph__action"
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
          </>
        }
      />

      {/* ── Sub-header ── */}
      <div className="bp-subheader">
        <Link to="/home" className="bp-back">
          <ArrowLeft size={18} /> Retour
        </Link>
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
        <button
          className={`bp-tabs__btn ${tab === "recurrences" ? "bp-tabs__btn--active" : ""}`}
          onClick={() => setTab("recurrences")}
        >
          <RefreshCw size={14} /> Récurrences
        </button>
      </div>

      {/* ── Content ── */}
      <main className="bp-content">
        {tab === "overview" && (
          <>
            <BudgetOverview />
          </>
        )}
        {tab === "transactions" && <TransactionsView />}
        {tab === "envelopes" && <EnvelopeManager />}
        {tab === "recurrences" && (
          <>
            <RedPeriodAlert />
            <RecurrenceManager />
            <SpendingCalendar month={selectedMonth} />
          </>
        )}
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

      {/* ── Onboarding Wizard ── */}
      {showOnboarding && (
        <OnboardingWizard onClose={() => setShowOnboarding(false)} />
      )}
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
