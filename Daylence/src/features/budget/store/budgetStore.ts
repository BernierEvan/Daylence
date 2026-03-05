import { create } from "zustand";
import type { Transaction, BudgetGoal, Category, MonthSummary } from "../types";

// ── Sample seed data ──
const SEED_TRANSACTIONS: Transaction[] = [
  { id: "1", type: "income", amount: 2800, category: "salaire", label: "Salaire Mars", date: "2026-03-01", note: "Virement employeur" },
  { id: "2", type: "income", amount: 450, category: "freelance", label: "Mission design", date: "2026-03-03", note: "Client Acme Corp" },
  { id: "3", type: "expense", amount: 850, category: "logement", label: "Loyer", date: "2026-03-01" },
  { id: "4", type: "expense", amount: 62.30, category: "alimentation", label: "Courses Carrefour", date: "2026-03-02" },
  { id: "5", type: "expense", amount: 45, category: "transport", label: "Navigo mensuel", date: "2026-03-01" },
  { id: "6", type: "expense", amount: 9.99, category: "abonnements", label: "Spotify", date: "2026-03-01" },
  { id: "7", type: "expense", amount: 13.99, category: "abonnements", label: "Netflix", date: "2026-03-01" },
  { id: "8", type: "expense", amount: 35, category: "loisirs", label: "Cinéma + resto", date: "2026-03-04" },
  { id: "9", type: "expense", amount: 89.90, category: "shopping", label: "Chaussures Nike", date: "2026-03-03" },
  { id: "10", type: "expense", amount: 22, category: "sante", label: "Pharmacie", date: "2026-03-02" },
  { id: "11", type: "expense", amount: 200, category: "epargne", label: "Virement Livret A", date: "2026-03-01" },
  { id: "12", type: "expense", amount: 47.50, category: "alimentation", label: "Courses Franprix", date: "2026-03-05" },
  { id: "13", type: "expense", amount: 29.99, category: "education", label: "Livre TypeScript", date: "2026-03-04" },
  { id: "14", type: "income", amount: 120, category: "autre", label: "Remboursement ami", date: "2026-03-05" },
];

const SEED_GOALS: BudgetGoal[] = [
  { category: "alimentation", limit: 350 },
  { category: "transport", limit: 80 },
  { category: "loisirs", limit: 150 },
  { category: "shopping", limit: 100 },
  { category: "abonnements", limit: 50 },
];

interface BudgetState {
  transactions: Transaction[];
  goals: BudgetGoal[];
  selectedMonth: string; // "2026-03"

  // Actions
  addTransaction: (tx: Omit<Transaction, "id">) => void;
  removeTransaction: (id: string) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  setGoal: (category: Category, limit: number) => void;
  removeGoal: (category: Category) => void;
  setSelectedMonth: (month: string) => void;

  // Computed
  getMonthTransactions: () => Transaction[];
  getMonthSummary: () => MonthSummary;
  getRecentTransactions: (count: number) => Transaction[];
  getCategorySpent: (category: Category) => number;
}

let nextId = 100;

export const useBudgetStore = create<BudgetState>((set, get) => ({
  transactions: SEED_TRANSACTIONS,
  goals: SEED_GOALS,
  selectedMonth: "2026-03",

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
      transactions: s.transactions.map((t) => (t.id === id ? { ...t, ...data } : t)),
    }));
  },

  setGoal: (category, limit) => {
    set((s) => {
      const exists = s.goals.find((g) => g.category === category);
      if (exists) {
        return { goals: s.goals.map((g) => (g.category === category ? { ...g, limit } : g)) };
      }
      return { goals: [...s.goals, { category, limit }] };
    });
  },

  removeGoal: (category) => {
    set((s) => ({ goals: s.goals.filter((g) => g.category !== category) }));
  },

  setSelectedMonth: (month) => set({ selectedMonth: month }),

  getMonthTransactions: () => {
    const { transactions, selectedMonth } = get();
    return transactions
      .filter((t) => t.date.startsWith(selectedMonth))
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  getMonthSummary: () => {
    const txs = get().getMonthTransactions();
    const byCategory = {} as Record<Category, number>;
    let totalIncome = 0;
    let totalExpenses = 0;

    for (const tx of txs) {
      if (tx.type === "income") totalIncome += tx.amount;
      else totalExpenses += tx.amount;

      byCategory[tx.category] = (byCategory[tx.category] || 0) + tx.amount;
    }

    return {
      month: get().selectedMonth,
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
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
}));
