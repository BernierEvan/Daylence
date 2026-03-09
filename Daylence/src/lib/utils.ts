import { usePreferences } from "../features/settings/store/preferencesStore";
import type {
  TimeFormat,
  FirstDay,
} from "../features/settings/store/preferencesStore";

/* ════════════════════════════════════════
   Date / Time formatting utilities
   Uses preferences from the store.
   ════════════════════════════════════════ */

// ── Time ──

/** Format a Date to a time string respecting the user's time format preference. */
export function fmtTime(date: Date, timeFormat: TimeFormat): string {
  if (timeFormat === "12h") {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  return date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

/** Format a Date to a short date string (e.g. "9 mars" or "Mar 9"). */
export function fmtDateShort(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

/** Format a Date to a long date string with weekday (e.g. "dimanche 9 mars"). */
export function fmtDateLong(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ── Day-of-week ──

const LABELS_MON = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const;
const LABELS_SUN = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"] as const;

const LABELS_FULL_MON = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
] as const;
const LABELS_FULL_SUN = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
] as const;

const LABELS_MIN_MON = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"] as const;
const LABELS_MIN_SUN = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"] as const;

/** Short day labels (3 chars) ordered by firstDay preference. */
export function getDayLabels(firstDay: FirstDay): readonly string[] {
  return firstDay === "sunday" ? LABELS_SUN : LABELS_MON;
}

/** Full day labels ordered by firstDay preference. */
export function getDayLabelsFull(firstDay: FirstDay): readonly string[] {
  return firstDay === "sunday" ? LABELS_FULL_SUN : LABELS_FULL_MON;
}

/** Minimal day labels (2 chars) ordered by firstDay preference. */
export function getDayLabelsMin(firstDay: FirstDay): readonly string[] {
  return firstDay === "sunday" ? LABELS_MIN_SUN : LABELS_MIN_MON;
}

/**
 * Convert JS Date.getDay() (Sun=0) to an index where 0 = first day of user's week.
 * Monday-first: Mon=0 … Sun=6
 * Sunday-first: Sun=0 … Sat=6
 */
export function dayIndex(date: Date, firstDay: FirstDay): number {
  const jsDay = date.getDay(); // Sun=0
  if (firstDay === "sunday") return jsDay;
  return (jsDay + 6) % 7;
}

/** Today's day index based on firstDay preference. */
export function todayIndex(firstDay: FirstDay): number {
  return dayIndex(new Date(), firstDay);
}

// ── React hook ──

/** Hook to get formatting preferences from the store. */
export function useFormatPrefs() {
  const timeFormat = usePreferences((s) => s.timeFormat);
  const firstDay = usePreferences((s) => s.firstDay);
  return { timeFormat, firstDay };
}
