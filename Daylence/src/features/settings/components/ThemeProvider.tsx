import { useEffect } from "react";
import { usePreferences, THEME_PRESETS } from "../store/preferencesStore";

/* ═══════════════════════════════════════════════
   ThemeProvider – Applies CSS custom-properties
   and class-based modes to <html> based on the
   preferencesStore state.
   ═══════════════════════════════════════════════ */

const FONT_MAP: Record<string, string> = {
  small: "13px",
  normal: "16px",
  large: "18px",
  xlarge: "21px",
};

function hexToHSL(hex: string) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s: number;
  const l = (max + min) / 2;
  if (max === min) {
    s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const themeMode = usePreferences((s) => s.themeMode);
  const compact = usePreferences((s) => s.compact);
  const accentColor = usePreferences((s) => s.accentColor);
  const fontSize = usePreferences((s) => s.fontSize);
  const reduceAnimations = usePreferences((s) => s.reduceAnimations);
  const highContrast = usePreferences((s) => s.highContrast);
  const customThemeId = usePreferences((s) => s.customThemeId);
  const customBg = usePreferences((s) => s.customBg);

  useEffect(() => {
    const html = document.documentElement;
    const style = html.style;

    // ── Resolve effective mode ──
    let effectiveMode: "light" | "dark" = "light";
    if (themeMode === "system") {
      effectiveMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    } else {
      effectiveMode = themeMode;
    }

    // ── Theme preset overrides ──
    const preset = customThemeId
      ? THEME_PRESETS.find((t) => t.id === customThemeId)
      : null;

    const bg = preset?.bg ?? (effectiveMode === "dark" ? "#0f0f1a" : "#f4f5f7");
    const surface =
      preset?.surface ?? (effectiveMode === "dark" ? "#1a1a2e" : "#ffffff");
    const text =
      preset?.text ?? (effectiveMode === "dark" ? "#e0e0e0" : "#1a1a2e");
    const accent = accentColor;

    const hsl = hexToHSL(accent);

    // ── Derived semantic tokens ──
    const isDark = effectiveMode === "dark";
    const border = preset?.border ?? (isDark ? "#2a2d38" : "#e5e7eb");
    const textSecondary = isDark ? "#a0a0b0" : "#4f5660";
    const textMuted = isDark ? "#6b7280" : "#9ca3af";
    const surfaceAlt = isDark ? "#1e1e34" : "#f8fafc";
    const shadow = isDark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.07)";

    // ── CSS custom properties ──
    style.setProperty("--d-bg", bg);
    style.setProperty("--d-surface", surface);
    style.setProperty("--d-text", text);
    style.setProperty("--d-border", border);
    style.setProperty("--d-text-secondary", textSecondary);
    style.setProperty("--d-text-muted", textMuted);
    style.setProperty("--d-surface-alt", surfaceAlt);
    style.setProperty("--d-shadow", shadow);
    style.setProperty("--d-accent", accent);
    style.setProperty("--d-accent-h", `${hsl.h}`);
    style.setProperty("--d-accent-s", `${hsl.s}%`);
    style.setProperty("--d-accent-l", `${hsl.l}%`);
    style.setProperty(
      "--d-accent-light",
      `hsl(${hsl.h}, ${hsl.s}%, ${Math.min(hsl.l + 20, 95)}%)`,
    );
    style.setProperty(
      "--d-accent-dark",
      `hsl(${hsl.h}, ${hsl.s}%, ${Math.max(hsl.l - 15, 10)}%)`,
    );
    style.setProperty("--d-font-base", FONT_MAP[fontSize] ?? "16px");
    style.setProperty("--d-radius", compact ? "8px" : "14px");
    style.setProperty("--d-radius-sm", compact ? "6px" : "10px");
    style.setProperty("--d-radius-lg", compact ? "12px" : "20px");
    style.setProperty("--d-spacing", compact ? "8px" : "16px");
    style.setProperty("--d-spacing-xs", compact ? "4px" : "8px");
    style.setProperty("--d-spacing-lg", compact ? "12px" : "24px");
    style.setProperty("--d-padding", compact ? "12px" : "20px");
    style.setProperty("--d-padding-card", compact ? "14px" : "22px");
    style.setProperty("--d-gap", compact ? "8px" : "14px");
    style.setProperty("--d-header-py", compact ? "8px" : "12px");
    style.setProperty("--d-font-scale", compact ? "0.92" : "1");
    style.setProperty("--d-transition", reduceAnimations ? "0s" : "0.2s");

    // Custom background
    if (customBg) {
      if (customBg.startsWith("http") || customBg.startsWith("data:")) {
        style.setProperty("--d-bg-image", `url(${customBg})`);
      } else {
        style.setProperty("--d-bg-image", customBg);
      }
    } else {
      style.removeProperty("--d-bg-image");
    }

    // ── Class-based flags ──
    html.classList.toggle("dark", effectiveMode === "dark");
    html.classList.toggle("compact", compact);
    html.classList.toggle("reduce-motion", reduceAnimations);
    html.classList.toggle("high-contrast", highContrast);

    // Also set color-scheme
    style.setProperty("color-scheme", effectiveMode);

    // ── System theme listener ──
    if (themeMode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        const dark = mq.matches;
        html.classList.toggle("dark", dark);
        style.setProperty("color-scheme", dark ? "dark" : "light");
        style.setProperty("--d-bg", dark ? "#0f0f1a" : "#f4f5f7");
        style.setProperty("--d-surface", dark ? "#1a1a2e" : "#ffffff");
        style.setProperty("--d-text", dark ? "#e0e0e0" : "#1a1a2e");
        style.setProperty("--d-border", dark ? "#2a2d38" : "#e5e7eb");
        style.setProperty("--d-text-secondary", dark ? "#a0a0b0" : "#4f5660");
        style.setProperty("--d-text-muted", dark ? "#6b7280" : "#9ca3af");
        style.setProperty("--d-surface-alt", dark ? "#1e1e34" : "#f8fafc");
        style.setProperty(
          "--d-shadow",
          dark ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.07)",
        );
      };
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }
  }, [
    themeMode,
    compact,
    accentColor,
    fontSize,
    reduceAnimations,
    highContrast,
    customThemeId,
    customBg,
  ]);

  return <>{children}</>;
}
