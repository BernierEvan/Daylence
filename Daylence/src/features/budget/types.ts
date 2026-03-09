export type TransactionType = "expense" | "income";

export type Category =
  | "alimentation"
  | "transport"
  | "logement"
  | "loisirs"
  | "sante"
  | "shopping"
  | "education"
  | "abonnements"
  | "epargne"
  | "salaire"
  | "freelance"
  | "autre";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: Category;
  label: string;
  date: string; // ISO string
  note?: string;
}

export interface BudgetGoal {
  category: Category;
  limit: number; // monthly limit
}

export interface MonthSummary {
  month: string; // "2026-03"
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: Record<Category, number>;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; emoji: string; color: string }
> = {
  alimentation: { label: "Alimentation", emoji: "🛒", color: "#f59e0b" },
  transport: { label: "Transport", emoji: "🚗", color: "#3b82f6" },
  logement: { label: "Logement", emoji: "🏠", color: "#8b5cf6" },
  loisirs: { label: "Loisirs", emoji: "🎮", color: "#ec4899" },
  sante: { label: "Santé", emoji: "💊", color: "#ef4444" },
  shopping: { label: "Shopping", emoji: "🛍️", color: "#f97316" },
  education: { label: "Éducation", emoji: "📚", color: "#6366f1" },
  abonnements: { label: "Abonnements", emoji: "📱", color: "#14b8a6" },
  epargne: { label: "Épargne", emoji: "🏦", color: "#22c55e" },
  salaire: { label: "Salaire", emoji: "💰", color: "#10b981" },
  freelance: { label: "Freelance", emoji: "💻", color: "#0ea5e9" },
  autre: { label: "Autre", emoji: "📌", color: "#6b7280" },
};

export const EXPENSE_CATEGORIES: Category[] = [
  "alimentation",
  "transport",
  "logement",
  "loisirs",
  "sante",
  "shopping",
  "education",
  "abonnements",
  "epargne",
  "autre",
];

export const INCOME_CATEGORIES: Category[] = ["salaire", "freelance", "autre"];
