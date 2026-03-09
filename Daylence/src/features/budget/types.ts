// ══════════════════════════════════════════════
// Daylence Budget — Type definitions
// ══════════════════════════════════════════════

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
  date: string; // ISO "2026-03-01"
  note?: string;
}

/** Budget envelope with priority ranking */
export interface BudgetEnvelope {
  category: Category;
  priority: number; // 1 = highest (funded first)
  target: number; // monthly target amount
  allocated: number; // auto-calculated by algorithm
  isEssential: boolean; // essential = rent, food, etc.
}

export interface MonthSummary {
  month: string; // "2026-03"
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  distributed: number; // total allocated across envelopes
  remaining: number; // income - distributed
  byCategory: Partial<Record<Category, number>>;
}

/** Result of the priority allocation algorithm */
export interface AllocationResult {
  envelopes: BudgetEnvelope[];
  totalDistributed: number;
  remaining: number;
  deficit: number; // if income < sum of all targets
  unfundedCategories: Category[];
}

/** Monthly snapshot for historisation */
export interface MonthSnapshot {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  envelopes: BudgetEnvelope[];
  validatedAt?: string;
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

/** Smart categorization keywords → category mapping */
export const SMART_CATEGORY_MAP: Array<{
  keywords: string[];
  category: Category;
}> = [
  {
    keywords: [
      "loyer",
      "appartement",
      "charges",
      "edf",
      "engie",
      "eau",
      "electricité",
    ],
    category: "logement",
  },
  {
    keywords: [
      "courses",
      "carrefour",
      "lidl",
      "auchan",
      "franprix",
      "intermarché",
      "boulangerie",
      "restaurant",
      "uber eats",
      "deliveroo",
      "mcdo",
    ],
    category: "alimentation",
  },
  {
    keywords: [
      "navigo",
      "essence",
      "péage",
      "ratp",
      "sncf",
      "parking",
      "vélib",
      "taxi",
      "bolt",
    ],
    category: "transport",
  },
  {
    keywords: [
      "spotify",
      "netflix",
      "disney",
      "amazon prime",
      "youtube",
      "abonnement",
      "forfait",
      "mobile",
      "internet",
      "fibre",
    ],
    category: "abonnements",
  },
  {
    keywords: [
      "médecin",
      "pharmacie",
      "mutuelle",
      "dentiste",
      "ophtalmo",
      "kiné",
      "docteur",
    ],
    category: "sante",
  },
  {
    keywords: [
      "cinéma",
      "resto",
      "bar",
      "concert",
      "spectacle",
      "sortie",
      "bowling",
      "parc",
    ],
    category: "loisirs",
  },
  {
    keywords: [
      "zara",
      "h&m",
      "nike",
      "adidas",
      "amazon",
      "fnac",
      "vêtement",
      "chaussure",
      "achat",
    ],
    category: "shopping",
  },
  {
    keywords: [
      "livre",
      "formation",
      "cours",
      "udemy",
      "openclassroom",
      "école",
      "université",
    ],
    category: "education",
  },
  {
    keywords: [
      "épargne",
      "livret",
      "virement livret",
      "placement",
      "investissement",
    ],
    category: "epargne",
  },
  {
    keywords: ["salaire", "paye", "virement employeur", "paie"],
    category: "salaire",
  },
  {
    keywords: ["freelance", "mission", "facture", "client", "prestation"],
    category: "freelance",
  },
];

export function smartCategorize(label: string): Category | null {
  const lower = label.toLowerCase();
  for (const entry of SMART_CATEGORY_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.category;
    }
  }
  return null;
}
