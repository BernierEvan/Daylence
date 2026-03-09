import { create } from "zustand";
import type {
  Transaction,
  BudgetEnvelope,
  Category,
  MonthSummary,
  AllocationResult,
  MonthSnapshot,
} from "../types";

// ══════════════════════════════════════════════
// Priority Allocation Algorithm
// ══════════════════════════════════════════════

export function allocateByPriority(
  income: number,
  envelopes: BudgetEnvelope[],
): AllocationResult {
  const sorted = [...envelopes].sort((a, b) => a.priority - b.priority);
  let remaining = income;
  const unfunded: Category[] = [];

  const allocated = sorted.map((env) => {
    if (remaining >= env.target) {
      remaining -= env.target;
      return { ...env, allocated: env.target };
    }
    if (remaining > 0) {
      const partial = remaining;
      remaining = 0;
      unfunded.push(env.category);
      return { ...env, allocated: partial };
    }
    unfunded.push(env.category);
    return { ...env, allocated: 0 };
  });

  const totalTargets = envelopes.reduce((s, e) => s + e.target, 0);
  const totalDistributed = income - remaining;

  return {
    envelopes: allocated,
    totalDistributed,
    remaining,
    deficit: Math.max(0, totalTargets - income),
    unfundedCategories: unfunded,
  };
}

// ══════════════════════════════════════════════
// Seed data
// ══════════════════════════════════════════════

const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "income",
    amount: 2800,
    category: "salaire",
    label: "Salaire Mars",
    date: "2026-03-01",
    note: "Virement employeur",
  },
  {
    id: "2",
    type: "income",
    amount: 450,
    category: "freelance",
    label: "Mission design",
    date: "2026-03-03",
    note: "Client Acme Corp",
  },
  {
    id: "3",
    type: "expense",
    amount: 850,
    category: "logement",
    label: "Loyer",
    date: "2026-03-01",
  },
  {
    id: "4",
    type: "expense",
    amount: 62.3,
    category: "alimentation",
    label: "Courses Carrefour",
    date: "2026-03-02",
  },
  {
    id: "5",
    type: "expense",
    amount: 45,
    category: "transport",
    label: "Navigo mensuel",
    date: "2026-03-01",
  },
  {
    id: "6",
    type: "expense",
    amount: 9.99,
    category: "abonnements",
    label: "Spotify",
    date: "2026-03-01",
  },
  {
    id: "7",
    type: "expense",
    amount: 13.99,
    category: "abonnements",
    label: "Netflix",
    date: "2026-03-01",
  },
  {
    id: "8",
    type: "expense",
    amount: 35,
    category: "loisirs",
    label: "Cinéma + resto",
    date: "2026-03-04",
  },
  {
    id: "9",
    type: "expense",
    amount: 89.9,
    category: "shopping",
    label: "Chaussures Nike",
    date: "2026-03-03",
  },
  {
    id: "10",
    type: "expense",
    amount: 22,
    category: "sante",
    label: "Pharmacie",
    date: "2026-03-02",
  },
  {
    id: "11",
    type: "expense",
    amount: 200,
    category: "epargne",
    label: "Virement Livret A",
    date: "2026-03-01",
  },
  {
    id: "12",
    type: "expense",
    amount: 47.5,
    category: "alimentation",
    label: "Courses Franprix",
    date: "2026-03-05",
  },
  {
    id: "13",
    type: "expense",
    amount: 29.99,
    category: "education",
    label: "Livre TypeScript",
    date: "2026-03-04",
  },
  {
    id: "14",
    type: "income",
    amount: 120,
    category: "autre",
    label: "Remboursement ami",
    date: "2026-03-05",
  },
];

const SEED_ENVELOPES: BudgetEnvelope[] = [
  {
    category: "logement",
    priority: 1,
    target: 900,
    allocated: 0,
    isEssential: true,
  },
  {
    category: "alimentation",
    priority: 2,
    target: 350,
    allocated: 0,
    isEssential: true,
  },
  {
    category: "transport",
    priority: 3,
    target: 80,
    allocated: 0,
    isEssential: true,
  },
  {
    category: "sante",
    priority: 4,
    target: 60,
    allocated: 0,
    isEssential: true,
  },
  {
    category: "abonnements",
    priority: 5,
    target: 50,
    allocated: 0,
    isEssential: false,
  },
  {
    category: "epargne",
    priority: 6,
    target: 400,
    allocated: 0,
    isEssential: false,
  },
  {
    category: "education",
    priority: 7,
    target: 100,
    allocated: 0,
    isEssential: false,
  },
  {
    category: "loisirs",
    priority: 8,
    target: 150,
    allocated: 0,
    isEssential: false,
  },
  {
    category: "shopping",
    priority: 9,
    target: 100,
    allocated: 0,
    isEssential: false,
  },
];

// ══════════════════════════════════════════════
// Store
// ══════════════════════════════════════════════

interface BudgetState {
  transactions: Transaction[];
  envelopes: BudgetEnvelope[];
  selectedMonth: string;
  snapshots: MonthSnapshot[];
  allocationRun: boolean; // has the user run allocation this month?

  // Transaction actions
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;

  // Envelope actions
  setEnvelope: (
    category: Category,
    target: number,
    priority: number,
    isEssential: boolean,
  ) => void;
  removeEnvelope: (category: Category) => void;
  reorderEnvelopes: (envelopes: BudgetEnvelope[]) => void;

  // Allocation
  runAllocation: () => AllocationResult;
  adjustEnvelopeAllocation: (category: Category, amount: number) => void;

  // Month navigation
  setSelectedMonth: (month: string) => void;
  validateMonth: () => void;

  // Computed
  getMonthTransactions: () => Transaction[];
  getMonthSummary: () => MonthSummary;
  getRecentTransactions: (count: number) => Transaction[];
  getCategorySpent: (category: Category) => number;
  getAllocation: () => AllocationResult;
  getSnapshot: (month: string) => MonthSnapshot | undefined;

  // Import/Export
  exportData: () => string;
  importData: (json: string) => boolean;
}

let nextId = 100;

export const useBudgetStore = create<BudgetState>((set, get) => ({
  transactions: SEED_TRANSACTIONS,
  envelopes: SEED_ENVELOPES,
  selectedMonth: "2026-03",
  snapshots: [],
  allocationRun: false,

  // ── Transaction CRUD ──

  addTransaction: (tx) => {
    const id = String(++nextId);
    set((s) => ({
      transactions: [{ ...tx, id }, ...s.transactions],
    }));
  },

  removeTransaction: (id) => {
    set((s) => ({
      transactions: s.transactions.filter((t) => t.id !== id),
    }));
  },

  updateTransaction: (id, data) => {
    set((s) => ({
      transactions: s.transactions.map((t) =>
        t.id === id ? { ...t, ...data } : t,
      ),
    }));
  },

  // ── Envelope management ──

  setEnvelope: (category, target, priority, isEssential) => {
    set((s) => {
      const exists = s.envelopes.find((e) => e.category === category);
      if (exists) {
        return {
          envelopes: s.envelopes.map((e) =>
            e.category === category
              ? { ...e, target, priority, isEssential }
              : e,
          ),
        };
      }
      return {
        envelopes: [
          ...s.envelopes,
          { category, priority, target, allocated: 0, isEssential },
        ],
      };
    });
  },

  removeEnvelope: (category) => {
    set((s) => ({
      envelopes: s.envelopes.filter((e) => e.category !== category),
    }));
  },

  reorderEnvelopes: (envelopes) => set({ envelopes }),

  // ── Allocation ──

  runAllocation: () => {
    const { envelopes } = get();
    const summary = get().getMonthSummary();
    const result = allocateByPriority(summary.totalIncome, envelopes);
    set({ envelopes: result.envelopes, allocationRun: true });
    return result;
  },

  adjustEnvelopeAllocation: (category, amount) => {
    set((s) => ({
      envelopes: s.envelopes.map((e) =>
        e.category === category ? { ...e, allocated: Math.max(0, amount) } : e,
      ),
    }));
  },

  // ── Month navigation ──

  setSelectedMonth: (month) =>
    set({ selectedMonth: month, allocationRun: false }),

  validateMonth: () => {
    const summary = get().getMonthSummary();
    const { envelopes, selectedMonth, snapshots } = get();
    const snapshot: MonthSnapshot = {
      month: selectedMonth,
      totalIncome: summary.totalIncome,
      totalExpenses: summary.totalExpenses,
      balance: summary.balance,
      envelopes: [...envelopes],
      validatedAt: new Date().toISOString(),
    };
    set({
      snapshots: [
        ...snapshots.filter((s) => s.month !== selectedMonth),
        snapshot,
      ],
    });
  },

  // ── Computed ──

  getMonthTransactions: () => {
    const { transactions, selectedMonth } = get();
    return transactions
      .filter((t) => t.date.startsWith(selectedMonth))
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  getMonthSummary: () => {
    const txs = get().getMonthTransactions();
    const { envelopes } = get();
    const byCategory: Partial<Record<Category, number>> = {};
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const tx of txs) {
      if (tx.type === "income") totalIncome += tx.amount;
      else totalExpenses += tx.amount;
      byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
    }

    const distributed = envelopes.reduce((s, e) => s + e.allocated, 0);

    return {
      month: get().selectedMonth,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      distributed,
      remaining: totalIncome - distributed,
      byCategory,
    };
  },

  getRecentTransactions: (count) => {
    return get().getMonthTransactions().slice(0, count);
  },

  getCategorySpent: (category) => {
    return get()
      .getMonthTransactions()
      .filter((t) => t.type === "expense" && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  },

  getAllocation: () => {
    const { envelopes } = get();
    const summary = get().getMonthSummary();
    return allocateByPriority(summary.totalIncome, envelopes);
  },

  getSnapshot: (month) => {
    return get().snapshots.find((s) => s.month === month);
  },

  // ── Import/Export ──

  exportData: () => {
    const { transactions, envelopes, snapshots } = get();
    return JSON.stringify({ transactions, envelopes, snapshots }, null, 2);
  },

  importData: (json) => {
    try {
      const data = JSON.parse(json);
      if (data.transactions && data.envelopes) {
        set({
          transactions: data.transactions,
          envelopes: data.envelopes,
          snapshots: data.snapshots || [],
        });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },
}));
