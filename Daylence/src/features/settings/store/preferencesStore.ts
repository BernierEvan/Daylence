import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ═══════════════════════════════════════════════
   Daylence – Global Preferences Store
   All 27 user-configurable settings, persisted.
   ═══════════════════════════════════════════════ */

/* ── Enums / Literal types ── */

export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "normal" | "large";
export type Language = "fr" | "en";
export type TimeFormat = "24h" | "12h";
export type FirstDay = "monday" | "sunday";
export type Currency = "EUR" | "USD" | "GBP";
export type DefaultPage =
  | "/"
  | "/todos"
  | "/budget"
  | "/transport"
  | "/recipes"
  | "/sleep"
  | "/work";
export type PinMode = "full" | "apps";

export interface AccentColor {
  name: string;
  value: string; // hex
}

export const ACCENT_PRESETS: AccentColor[] = [
  { name: "Violet", value: "#6366f1" },
  { name: "Bleu", value: "#3b82f6" },
  { name: "Émeraude", value: "#10b981" },
  { name: "Rose", value: "#ec4899" },
  { name: "Orange", value: "#f97316" },
  { name: "Rouge", value: "#ef4444" },
  { name: "Jaune", value: "#eab308" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Noir", value: "#1a1a2e" },
];

export interface ThemePreset {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  surface: string;
  text: string;
  accent: string;
  mode: "light" | "dark";
  border: string;
  textSecondary: string;
  textMuted: string;
  surfaceAlt: string;
  shadow: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  /* ── Light themes ── */
  {
    id: "default-light",
    name: "Daylence Clair",
    emoji: "☀️",
    bg: "#f4f5f7",
    surface: "#ffffff",
    text: "#1a1a2e",
    accent: "#6366f1",
    mode: "light",
    border: "#e5e7eb",
    textSecondary: "#4f5660",
    textMuted: "#9ca3af",
    surfaceAlt: "#f8fafc",
    shadow: "rgba(0,0,0,0.07)",
  },
  {
    id: "lavender",
    name: "Lavande",
    emoji: "💜",
    bg: "#f5f0ff",
    surface: "#ffffff",
    text: "#2e1065",
    accent: "#9333ea",
    mode: "light",
    border: "#e9d5ff",
    textSecondary: "#6b21a8",
    textMuted: "#a78bfa",
    surfaceAlt: "#faf5ff",
    shadow: "rgba(107,33,168,0.08)",
  },
  {
    id: "mint",
    name: "Menthe",
    emoji: "🍃",
    bg: "#ecfdf5",
    surface: "#ffffff",
    text: "#064e3b",
    accent: "#059669",
    mode: "light",
    border: "#a7f3d0",
    textSecondary: "#047857",
    textMuted: "#6ee7b7",
    surfaceAlt: "#f0fdf4",
    shadow: "rgba(5,150,105,0.07)",
  },
  {
    id: "rose",
    name: "Rose doré",
    emoji: "🌸",
    bg: "#fff1f2",
    surface: "#ffffff",
    text: "#4c0519",
    accent: "#e11d48",
    mode: "light",
    border: "#fecdd3",
    textSecondary: "#9f1239",
    textMuted: "#fda4af",
    surfaceAlt: "#fff5f6",
    shadow: "rgba(225,29,72,0.07)",
  },
  {
    id: "sand",
    name: "Sable",
    emoji: "🏖️",
    bg: "#fefce8",
    surface: "#fffef5",
    text: "#422006",
    accent: "#ca8a04",
    mode: "light",
    border: "#fde68a",
    textSecondary: "#854d0e",
    textMuted: "#d97706",
    surfaceAlt: "#fefdf0",
    shadow: "rgba(202,138,4,0.08)",
  },
  {
    id: "arctic",
    name: "Arctique",
    emoji: "❄️",
    bg: "#f0f9ff",
    surface: "#ffffff",
    text: "#0c4a6e",
    accent: "#0284c7",
    mode: "light",
    border: "#bae6fd",
    textSecondary: "#0369a1",
    textMuted: "#7dd3fc",
    surfaceAlt: "#f0f9ff",
    shadow: "rgba(2,132,199,0.07)",
  },
  {
    id: "peach",
    name: "Pêche",
    emoji: "🍑",
    bg: "#fff7ed",
    surface: "#ffffff",
    text: "#431407",
    accent: "#ea580c",
    mode: "light",
    border: "#fed7aa",
    textSecondary: "#c2410c",
    textMuted: "#fb923c",
    surfaceAlt: "#fffaf5",
    shadow: "rgba(234,88,12,0.07)",
  },
  /* ── Dark themes ── */
  {
    id: "default-dark",
    name: "Daylence Sombre",
    emoji: "🌙",
    bg: "#0f0f1a",
    surface: "#1a1a2e",
    text: "#e0e0e0",
    accent: "#818cf8",
    mode: "dark",
    border: "#2a2d38",
    textSecondary: "#a0a0b0",
    textMuted: "#6b7280",
    surfaceAlt: "#1e1e34",
    shadow: "rgba(0,0,0,0.35)",
  },
  {
    id: "ocean",
    name: "Océan",
    emoji: "🌊",
    bg: "#0a1628",
    surface: "#0f2340",
    text: "#cbd5e1",
    accent: "#38bdf8",
    mode: "dark",
    border: "#1e3a5f",
    textSecondary: "#7dd3fc",
    textMuted: "#475569",
    surfaceAlt: "#0d1d35",
    shadow: "rgba(0,0,0,0.45)",
  },
  {
    id: "forest",
    name: "Forêt",
    emoji: "🌲",
    bg: "#071209",
    surface: "#0f2415",
    text: "#d1e7dd",
    accent: "#34d399",
    mode: "dark",
    border: "#1a3d24",
    textSecondary: "#6ee7b7",
    textMuted: "#4b6a55",
    surfaceAlt: "#0c1e12",
    shadow: "rgba(0,0,0,0.45)",
  },
  {
    id: "sunset",
    name: "Coucher de soleil",
    emoji: "🌅",
    bg: "#18080c",
    surface: "#2a1018",
    text: "#fbd5c8",
    accent: "#fb923c",
    mode: "dark",
    border: "#3d1a22",
    textSecondary: "#fdba74",
    textMuted: "#6b4040",
    surfaceAlt: "#200e14",
    shadow: "rgba(0,0,0,0.45)",
  },
  {
    id: "midnight",
    name: "Minuit",
    emoji: "🌌",
    bg: "#020617",
    surface: "#0f172a",
    text: "#e2e8f0",
    accent: "#a78bfa",
    mode: "dark",
    border: "#1e293b",
    textSecondary: "#94a3b8",
    textMuted: "#475569",
    surfaceAlt: "#0b1120",
    shadow: "rgba(0,0,0,0.5)",
  },
  {
    id: "cherry",
    name: "Cerise",
    emoji: "🍒",
    bg: "#1a0a10",
    surface: "#2a1520",
    text: "#f5d0de",
    accent: "#f43f5e",
    mode: "dark",
    border: "#3f1525",
    textSecondary: "#fda4af",
    textMuted: "#6b4050",
    surfaceAlt: "#220e18",
    shadow: "rgba(0,0,0,0.45)",
  },
  {
    id: "nord",
    name: "Nord",
    emoji: "🏔️",
    bg: "#2e3440",
    surface: "#3b4252",
    text: "#eceff4",
    accent: "#88c0d0",
    mode: "dark",
    border: "#434c5e",
    textSecondary: "#d8dee9",
    textMuted: "#616e88",
    surfaceAlt: "#353c4a",
    shadow: "rgba(0,0,0,0.3)",
  },
];

/* ── Module definition for ordering/favorites/hidden ── */

export interface ModuleConfig {
  id: string;
  visible: boolean;
  favorited: boolean;
}

export const DEFAULT_MODULES: ModuleConfig[] = [
  { id: "recipes", visible: true, favorited: false },
  { id: "sleep", visible: true, favorited: false },
  { id: "transport", visible: true, favorited: false },
  { id: "budget", visible: true, favorited: false },
  { id: "work", visible: true, favorited: false },
  { id: "todos", visible: true, favorited: false },
  { id: "appblock", visible: true, favorited: false },
];

/* ── Profile ── */

export interface Profile {
  id: string;
  name: string;
  emoji: string;
}

/* ── Notification settings ── */

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  soundEnabled: boolean;
  trajetAlertMinutes: number; // 0 = disabled
  todoReminders: boolean;
  sleepReminderTime: string; // "HH:mm" or "" disabled
  morningSummary: boolean;
}

/* ── Main state ── */

export interface PreferencesState {
  // Appearance
  themeMode: ThemeMode;
  compact: boolean;
  accentColor: string;
  fontSize: FontSize;
  customThemeId: string | null; // reference to THEME_PRESETS[].id
  customBg: string; // custom wallpaper URL or gradient CSS
  customBgBlur: number; // 0–100 blur intensity for custom wallpaper
  modules: ModuleConfig[];

  // Notifications
  notifications: NotificationSettings;

  // Data & Privacy
  retentionMonths: number; // 0 = unlimited
  analyticsEnabled: boolean;
  locationEnabled: boolean;
  historyEnabled: boolean;

  // Behavior
  defaultPage: DefaultPage;
  language: Language;
  timeFormat: TimeFormat;
  firstDay: FirstDay;
  currency: Currency;

  // Accessibility
  reduceAnimations: boolean;
  highContrast: boolean;
  offlineMode: boolean;

  // Security
  pinCode: string; // "" = disabled
  pinEnabled: boolean;
  pinMode: PinMode; // "full" = lock whole site, "apps" = lock selected modules
  hiddenModules: string[]; // module ids locked behind PIN (apps mode)

  // Profiles
  profiles: Profile[];
  activeProfileId: string;

  // ── Actions ──
  set: <K extends keyof PreferencesState>(
    key: K,
    value: PreferencesState[K],
  ) => void;
  setNotification: <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K],
  ) => void;
  toggleModule: (id: string, field: "visible" | "favorited") => void;
  reorderModules: (fromIdx: number, toIdx: number) => void;
  toggleHiddenModule: (moduleId: string) => void;
  addProfile: (name: string, emoji: string) => void;
  removeProfile: (id: string) => void;
  switchProfile: (id: string) => void;
  setPin: (code: string) => void;
  clearPin: () => void;
  exportData: () => string;
  clearAllData: () => void;
  clearModuleData: (moduleKey: string) => void;
  applyThemePreset: (presetId: string) => void;
  resetToDefaults: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  pushEnabled: true,
  emailEnabled: false,
  soundEnabled: true,
  trajetAlertMinutes: 15,
  todoReminders: true,
  sleepReminderTime: "22:30",
  morningSummary: true,
};

const DEFAULTS: Pick<
  PreferencesState,
  | "themeMode"
  | "compact"
  | "accentColor"
  | "fontSize"
  | "customThemeId"
  | "customBg"
  | "customBgBlur"
  | "modules"
  | "notifications"
  | "retentionMonths"
  | "analyticsEnabled"
  | "locationEnabled"
  | "historyEnabled"
  | "defaultPage"
  | "language"
  | "timeFormat"
  | "firstDay"
  | "currency"
  | "reduceAnimations"
  | "highContrast"
  | "offlineMode"
  | "pinCode"
  | "pinEnabled"
  | "pinMode"
  | "hiddenModules"
  | "profiles"
  | "activeProfileId"
> = {
  themeMode: "light",
  compact: false,
  accentColor: "#6366f1",
  fontSize: "normal",
  customThemeId: null,
  customBg: "",
  customBgBlur: 0,
  modules: DEFAULT_MODULES,
  notifications: DEFAULT_NOTIFICATIONS,
  retentionMonths: 0,
  analyticsEnabled: true,
  locationEnabled: false,
  historyEnabled: true,
  defaultPage: "/",
  language: "fr",
  timeFormat: "24h",
  firstDay: "monday",
  currency: "EUR",
  reduceAnimations: false,
  highContrast: false,
  offlineMode: false,
  pinCode: "",
  pinEnabled: false,
  pinMode: "full" as PinMode,
  hiddenModules: [],
  profiles: [{ id: "default", name: "Principal", emoji: "🏠" }],
  activeProfileId: "default",
};

export const usePreferences = create<PreferencesState>()(
  persist(
    (set, get) => ({
      ...DEFAULTS,

      set: (key, value) => set({ [key]: value } as Partial<PreferencesState>),

      setNotification: (key, value) =>
        set((s) => ({ notifications: { ...s.notifications, [key]: value } })),

      toggleModule: (id, field) =>
        set((s) => ({
          modules: s.modules.map((m) =>
            m.id === id ? { ...m, [field]: !m[field] } : m,
          ),
        })),

      reorderModules: (fromIdx, toIdx) =>
        set((s) => {
          const mods = [...s.modules];
          const [item] = mods.splice(fromIdx, 1);
          mods.splice(toIdx, 0, item);
          return { modules: mods };
        }),

      toggleHiddenModule: (moduleId) =>
        set((s) => ({
          hiddenModules: s.hiddenModules.includes(moduleId)
            ? s.hiddenModules.filter((m) => m !== moduleId)
            : [...s.hiddenModules, moduleId],
        })),

      addProfile: (name, emoji) =>
        set((s) => ({
          profiles: [
            ...s.profiles,
            { id: `profile-${Date.now()}`, name, emoji },
          ],
        })),

      removeProfile: (id) =>
        set((s) => ({
          profiles: s.profiles.filter((p) => p.id !== id),
          activeProfileId:
            s.activeProfileId === id ? "default" : s.activeProfileId,
        })),

      switchProfile: (id) => set({ activeProfileId: id }),

      setPin: (code) => set({ pinCode: code, pinEnabled: true }),
      clearPin: () =>
        set({
          pinCode: "",
          pinEnabled: false,
          pinMode: "full" as PinMode,
          hiddenModules: [],
        }),

      exportData: () => {
        const keys = [
          "daylence-prefs",
          "daylence-widgets",
          "daylence-budget",
          "daylence-todos",
          "daylence-sleep",
          "daylence-transport",
          "daylence-recipes",
          "daylence-work",
        ];
        const data: Record<string, unknown> = {};
        for (const k of keys) {
          const raw = localStorage.getItem(k);
          if (raw) {
            try {
              data[k] = JSON.parse(raw);
            } catch {
              data[k] = raw;
            }
          }
        }
        return JSON.stringify(data, null, 2);
      },

      clearAllData: () => {
        const keep = localStorage.getItem("daylence-prefs");
        localStorage.clear();
        if (keep) localStorage.setItem("daylence-prefs", keep);
      },

      clearModuleData: (moduleKey) => {
        localStorage.removeItem(`daylence-${moduleKey}`);
      },

      applyThemePreset: (presetId) => {
        const preset = THEME_PRESETS.find((t) => t.id === presetId);
        if (!preset) return;
        set({
          customThemeId: presetId,
          themeMode: preset.mode,
          accentColor: preset.accent,
        });
      },

      resetToDefaults: () => set({ ...DEFAULTS }),
    }),
    { name: "daylence-prefs" },
  ),
);
