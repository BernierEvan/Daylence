import { create } from "zustand";
import { persist } from "zustand/middleware";

/* ═══════════════════════════════════════════════
   Daylence – Global Preferences Store
   All 27 user-configurable settings, persisted.
   ═══════════════════════════════════════════════ */

/* ── Enums / Literal types ── */

export type ThemeMode = "light" | "dark" | "system";
export type FontSize = "small" | "normal" | "large" | "xlarge";
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
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "default-light",
    name: "Daylence Clair",
    emoji: "☀️",
    bg: "#f4f5f7",
    surface: "#ffffff",
    text: "#1a1a2e",
    accent: "#6366f1",
    mode: "light",
  },
  {
    id: "default-dark",
    name: "Daylence Sombre",
    emoji: "🌙",
    bg: "#0f0f1a",
    surface: "#1a1a2e",
    text: "#e0e0e0",
    accent: "#818cf8",
    mode: "dark",
  },
  {
    id: "ocean",
    name: "Océan",
    emoji: "🌊",
    bg: "#0c1929",
    surface: "#132f4c",
    text: "#b2bac2",
    accent: "#5090d3",
    mode: "dark",
  },
  {
    id: "forest",
    name: "Forêt",
    emoji: "🌲",
    bg: "#0d1f0d",
    surface: "#1a3a1a",
    text: "#c8e6c9",
    accent: "#4caf50",
    mode: "dark",
  },
  {
    id: "sunset",
    name: "Coucher de soleil",
    emoji: "🌅",
    bg: "#1a0a0a",
    surface: "#2d1515",
    text: "#ffccbc",
    accent: "#ff7043",
    mode: "dark",
  },
  {
    id: "lavender",
    name: "Lavande",
    emoji: "💜",
    bg: "#f3e8ff",
    surface: "#ffffff",
    text: "#3b0764",
    accent: "#9333ea",
    mode: "light",
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
  },
  {
    id: "midnight",
    name: "Minuit",
    emoji: "🌌",
    bg: "#020617",
    surface: "#0f172a",
    text: "#94a3b8",
    accent: "#6366f1",
    mode: "dark",
  },
  {
    id: "sand",
    name: "Sable",
    emoji: "🏖️",
    bg: "#fefce8",
    surface: "#ffffff",
    text: "#422006",
    accent: "#ca8a04",
    mode: "light",
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
  moduleIcons: Record<string, string>; // moduleId → emoji override

  // Home page
  showSubscription: boolean;
  showModules: boolean;
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
  hiddenModules: string[]; // module ids hidden behind PIN

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
  setModuleIcon: (moduleId: string, emoji: string) => void;
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
  | "moduleIcons"
  | "showSubscription"
  | "showModules"
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
  moduleIcons: {},
  showSubscription: true,
  showModules: true,
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

      setModuleIcon: (moduleId, emoji) =>
        set((s) => ({
          moduleIcons: { ...s.moduleIcons, [moduleId]: emoji },
        })),

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
        set({ pinCode: "", pinEnabled: false, hiddenModules: [] }),

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
