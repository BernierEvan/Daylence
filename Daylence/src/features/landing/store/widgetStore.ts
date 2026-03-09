import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ── Widget type catalogue (only "trajet" for now) ── */
export type WidgetType = "trajet";

export interface WidgetTypeDef {
  type: WidgetType;
  label: string;
  emoji: string;
  description: string;
}

export const WIDGET_CATALOGUE: WidgetTypeDef[] = [
  {
    type: "trajet",
    label: "Trajet en direct",
    emoji: "🚆",
    description: "Suivez les prochains départs entre 2 gares en temps réel.",
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
