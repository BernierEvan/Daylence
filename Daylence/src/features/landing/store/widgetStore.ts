import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ── Widget categories ── */
export type WidgetCategory = "transport" | "todos";

export interface WidgetCategoryDef {
  id: WidgetCategory;
  label: string;
  emoji: string;
  color: string;
}

export const WIDGET_CATEGORIES: WidgetCategoryDef[] = [
  { id: "transport", label: "Transport", emoji: "🚆", color: "#D97D37" },
  { id: "todos", label: "To-do", emoji: "✅", color: "#B02736" },
];

/* ── Widget type catalogue ── */
export type WidgetType =
  | "trajet"
  | "todo-agenda"
  | "todo-grocery"
  | "todo-meals"
  | "todo-fridge"
  | "todo-habits"
  | "todo-notes";

export interface WidgetTypeDef {
  type: WidgetType;
  category: WidgetCategory;
  label: string;
  emoji: string;
  description: string;
}

export const WIDGET_CATALOGUE: WidgetTypeDef[] = [
  {
    type: "trajet",
    category: "transport",
    label: "Trajet en direct",
    emoji: "🚆",
    description: "Suivez les prochains départs entre 2 gares en temps réel.",
  },
  {
    type: "todo-agenda",
    category: "todos",
    label: "Agenda du jour",
    emoji: "📋",
    description: "Vos tâches du jour avec récurrence et priorité.",
  },
  {
    type: "todo-grocery",
    category: "todos",
    label: "Courses",
    emoji: "🛒",
    description: "Aperçu de vos listes de courses en cours.",
  },
  {
    type: "todo-meals",
    category: "todos",
    label: "Repas du jour",
    emoji: "🍽️",
    description: "Les repas planifiés pour aujourd'hui.",
  },
  {
    type: "todo-fridge",
    category: "todos",
    label: "Alertes frigo",
    emoji: "❄️",
    description: "Produits bientôt périmés dans votre frigo.",
  },
  {
    type: "todo-habits",
    category: "todos",
    label: "Habitudes",
    emoji: "✦",
    description: "Suivi de vos habitudes du jour.",
  },
  {
    type: "todo-notes",
    category: "todos",
    label: "Notes rapides",
    emoji: "💭",
    description: "Vos notes épinglées et récentes.",
  },
];

/* ── Per-instance config ── */
export interface TrajetConfig {
  fromId: string;
  fromLabel: string;
  toId: string;
  toLabel: string;
}

export interface WidgetInstance {
  id: string;
  type: WidgetType;
  config: TrajetConfig | null;
}

/* ── Store ── */
interface WidgetState {
  widgets: WidgetInstance[];
  addWidget: (type: WidgetType) => void;
  removeWidget: (id: string) => void;
  configureTrajet: (id: string, config: TrajetConfig) => void;
}

export const useWidgetStore = create<WidgetState>()(
  persist(
    (set) => ({
      widgets: [],

      addWidget: (type) =>
        set((s) => ({
          widgets: [
            ...s.widgets,
            { id: `${type}-${Date.now()}`, type, config: null },
          ],
        })),

      removeWidget: (id) =>
        set((s) => ({ widgets: s.widgets.filter((w) => w.id !== id) })),

      configureTrajet: (id, config) =>
        set((s) => ({
          widgets: s.widgets.map((w) => (w.id === id ? { ...w, config } : w)),
        })),
    }),
    { name: "daylence-widgets" },
  ),
);
