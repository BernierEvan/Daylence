import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Palette,
  Shield,
  Accessibility,
  Database,
  Info,
  Sun,
  Moon,
  Monitor,
  Check,
  Download,
  Trash2,
  Lock,
  User,
  GripVertical,
  Star,
  EyeOff,
  Plus,
  X,
  Image,
  Globe,
  Clock,
  Calendar,
  Coins,
  Zap,
  Volume2,
  Mail,
  Train,
  ListTodo,
  BedDouble,
  Sunrise,
  RotateCcw,
} from "lucide-react";
import {
  usePreferences,
  ACCENT_PRESETS,
  THEME_PRESETS,
  type ThemeMode,
  type FontSize,
  type Language,
  type TimeFormat,
  type FirstDay,
  type Currency,
  type DefaultPage,
  type ColorblindMode,
} from "../store/preferencesStore";
import { useAuth } from "../../auth/store/authStore";
import PageHeader from "../../../components/layout/PageHeader";
import "../css/SettingsProfile.css";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

/* ── Small reusable pieces ── */

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      className={`sp-toggle ${on ? "sp-toggle--on" : ""}`}
      onClick={onChange}
    >
      <span className="sp-toggle__thumb" />
    </button>
  );
}

function Select<T extends string>({
  value,
  options,
  labels,
  onChange,
}: {
  value: T;
  options: T[];
  labels: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <select
      className="sp-select"
      value={value}
      onChange={(e) => onChange(e.target.value as T)}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {labels[o]}
        </option>
      ))}
    </select>
  );
}

/* ── Sidebar sections ── */

const NAV = [
  { id: "appearance", icon: Palette, label: "Apparence" },
  { id: "themes", icon: Sun, label: "Thèmes" },
  { id: "modules", icon: GripVertical, label: "Modules" },
  { id: "notifications", icon: Bell, label: "Notifications" },
  { id: "behavior", icon: Globe, label: "Comportement" },
  { id: "privacy", icon: Shield, label: "Données" },
  { id: "accessibility", icon: Accessibility, label: "Accessibilité" },
  { id: "security", icon: Lock, label: "Sécurité" },
  { id: "profiles", icon: User, label: "Profils" },
  { id: "storage", icon: Database, label: "Stockage" },
  { id: "about", icon: Info, label: "À propos" },
];

/* ── Main ── */

export default function SettingsPage() {
  const [section, setSection] = useState("appearance");
  const prefs = usePreferences();
  const auth = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const isScrollingTo = useRef(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    description: string;
    action: () => void;
  } | null>(null);

  /* ── Scroll-spy: track which section is visible ── */
  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const els = ids
      .map((id) => document.getElementById(`sec-${id}`))
      .filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingTo.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace("sec-", "");
            setSection(id);
            break;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── PIN setup state ── */
  const [pinSetup, setPinSetup] = useState<{
    step: "new" | "confirm";
    code: string;
  } | null>(null);
  const [pinDraft, setPinDraft] = useState("");
  const [pinError, setPinError] = useState("");
  const [pinDisableVerify, setPinDisableVerify] = useState(false);

  /* ── New profile state ── */
  const [newProfileName, setNewProfileName] = useState("");
  const [newProfileEmoji, setNewProfileEmoji] = useState("🏢");

  const scrollTo = (id: string) => {
    setSection(id);
    isScrollingTo.current = true;
    document
      .getElementById(`sec-${id}`)
      ?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      isScrollingTo.current = false;
    }, 800);
  };

  /* ── Drag & Drop modules ── */
  const dragIdx = useRef<number | null>(null);
  const handleDragStart = (idx: number) => {
    dragIdx.current = idx;
  };
  const handleDrop = (idx: number) => {
    if (dragIdx.current !== null && dragIdx.current !== idx) {
      prefs.reorderModules(dragIdx.current, idx);
    }
    dragIdx.current = null;
  };

  /* ── Export ── */
  const handleExport = () => {
    const json = prefs.exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daylence-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ── Custom background ── */
  const handleBgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        prefs.set("customBg", reader.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="sp-page">
      {/* Header */}
      <PageHeader
        right={
          <>
            <Link to="/home" className="ph__nav-link">
              Accueil
            </Link>
            <Link to="/profile" className="ph__nav-link">
              Mon Profil
            </Link>
          </>
        }
      />

      <main className="sp-main">
        {/* Sidebar */}
        <div className="sp-sidebar">
          <h2 className="sp-sidebar__title">Paramètres</h2>
          <nav className="sp-sidebar__nav">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`sp-sidebar__link ${section === n.id ? "sp-sidebar__link--active" : ""}`}
                onClick={() => scrollTo(n.id)}
              >
                <n.icon size={18} />
                {n.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="sp-content">
          {/* ═══════ 1. APPEARANCE ═══════ */}
          <section id="sec-appearance" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Apparence</h3>
              <p className="sp-section__sub">
                Personnalisez l'apparence de Daylence.
              </p>
            </div>
            <div className="sp-card">
              {/* Theme mode */}
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Mode</span>
                  <span className="sp-row__desc">
                    Clair, sombre ou automatique
                  </span>
                </div>
                <div className="sp-mode-btns">
                  {[
                    { mode: "light" as ThemeMode, icon: Sun, label: "Clair" },
                    { mode: "dark" as ThemeMode, icon: Moon, label: "Sombre" },
                    {
                      mode: "system" as ThemeMode,
                      icon: Monitor,
                      label: "Auto",
                    },
                  ].map((m) => (
                    <button
                      key={m.mode}
                      className={`sp-mode-btn ${prefs.themeMode === m.mode ? "sp-mode-btn--active" : ""}`}
                      onClick={() => prefs.set("themeMode", m.mode)}
                    >
                      <m.icon size={16} />
                      <span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Compact */}
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Mode compact</span>
                  <span className="sp-row__desc">
                    Réduire les espacements et les bordures arrondies
                  </span>
                </div>
                <Toggle
                  on={prefs.compact}
                  onChange={() => prefs.set("compact", !prefs.compact)}
                />
              </div>

              {/* Accent color */}
              <div className="sp-row sp-row--col">
                <div className="sp-row__text">
                  <span className="sp-row__label">Couleur d'accent</span>
                  <span className="sp-row__desc">
                    Couleur principale de l'interface
                  </span>
                </div>
                <div className="sp-colors">
                  {ACCENT_PRESETS.map((c) => (
                    <button
                      key={c.value}
                      className={`sp-color ${prefs.accentColor === c.value ? "sp-color--active" : ""}`}
                      style={{ background: c.value }}
                      title={c.name}
                      onClick={() => prefs.set("accentColor", c.value)}
                    >
                      {prefs.accentColor === c.value && (
                        <Check size={14} color="#fff" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font size */}
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Taille de police</span>
                  <span className="sp-row__desc">
                    Ajuster la taille du texte
                  </span>
                </div>
                <Select
                  value={prefs.fontSize}
                  options={["small", "normal", "large"] as FontSize[]}
                  labels={{
                    small: "Petit",
                    normal: "Normal",
                    large: "Grand",
                  }}
                  onChange={(v) => prefs.set("fontSize", v)}
                />
              </div>

              {/* Custom background */}
              <div className="sp-row sp-row--col">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    Fond d'écran personnalisé
                  </span>
                  <span className="sp-row__desc">
                    Image ou gradient CSS en arrière-plan
                  </span>
                </div>
                <div className="sp-bg-row">
                  <input
                    className="sp-input"
                    placeholder="ex: linear-gradient(135deg, #667eea, #764ba2)"
                    value={
                      prefs.customBg.startsWith("data:")
                        ? "(image)"
                        : prefs.customBg
                    }
                    onChange={(e) => prefs.set("customBg", e.target.value)}
                    readOnly={prefs.customBg.startsWith("data:")}
                  />
                  <button
                    className="sp-btn sp-btn--outline sp-btn--sm"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Image size={14} /> Image
                  </button>
                  {prefs.customBg && (
                    <button
                      className="sp-btn sp-btn--outline sp-btn--sm"
                      onClick={() => {
                        prefs.set("customBg", "");
                        prefs.set("customBgBlur", 0);
                      }}
                    >
                      <X size={14} />
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleBgFile}
                  />
                </div>
                {prefs.customBg && (
                  <div className="sp-blur-row">
                    <span className="sp-blur-row__label">Flou</span>
                    <input
                      type="range"
                      className="sp-blur-row__slider"
                      min={0}
                      max={100}
                      value={prefs.customBgBlur}
                      onChange={(e) =>
                        prefs.set("customBgBlur", Number(e.target.value))
                      }
                    />
                    <span className="sp-blur-row__value">
                      {prefs.customBgBlur}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ═══════ 2. THEMES ═══════ */}
          <section id="sec-themes" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Thèmes</h3>
              <p className="sp-section__sub">
                Appliquez un thème prédéfini en un clic.
              </p>
            </div>
            <div className="sp-card">
              <div className="sp-themes">
                {THEME_PRESETS.map((t) => (
                  <button
                    key={t.id}
                    className={`sp-theme ${prefs.customThemeId === t.id ? "sp-theme--active" : ""}`}
                    onClick={() => prefs.applyThemePreset(t.id)}
                  >
                    <div
                      className="sp-theme__preview"
                      style={{
                        background: t.bg,
                        borderColor: t.border,
                      }}
                    >
                      <span
                        className="sp-theme__bar"
                        style={{ background: t.surface }}
                      />
                      <span
                        className="sp-theme__dot"
                        style={{ background: t.accent }}
                      />
                      <span
                        className="sp-theme__line"
                        style={{ background: t.text, opacity: 0.5 }}
                      />
                      <span
                        className="sp-theme__line sp-theme__line--short"
                        style={{ background: t.textSecondary, opacity: 0.35 }}
                      />
                    </div>
                    <span className="sp-theme__label">
                      {t.emoji} {t.name}
                    </span>
                    {prefs.customThemeId === t.id && (
                      <Check size={14} className="sp-theme__check" />
                    )}
                  </button>
                ))}
              </div>
              {prefs.customThemeId && (
                <div className="sp-row__actions" style={{ marginTop: 12 }}>
                  <button
                    className="sp-btn sp-btn--outline"
                    onClick={() => prefs.set("customThemeId", null)}
                  >
                    <RotateCcw size={14} /> Réinitialiser le thème
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* ═══════ 3. MODULES ═══════ */}
          <section id="sec-modules" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Modules</h3>
              <p className="sp-section__sub">
                Réorganisez, mettez en favoris ou masquez des modules. Glissez
                pour réordonner.
              </p>
            </div>
            <div className="sp-card">
              {prefs.modules.map((mod, idx) => (
                <div
                  key={mod.id}
                  className="sp-row sp-row--drag"
                  draggable
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(idx)}
                >
                  <GripVertical size={16} className="sp-row__grip" />
                  <span className="sp-row__emoji">
                    {getModuleEmoji(mod.id)}
                  </span>
                  <div className="sp-row__text" style={{ flex: 1 }}>
                    <span className="sp-row__label">
                      {getModuleLabel(mod.id)}
                    </span>
                  </div>
                  <button
                    className={`sp-icon-btn ${mod.favorited ? "sp-icon-btn--active" : ""}`}
                    title="Favori"
                    onClick={() => prefs.toggleModule(mod.id, "favorited")}
                  >
                    <Star
                      size={15}
                      fill={mod.favorited ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    className={`sp-icon-btn ${!mod.visible ? "sp-icon-btn--active" : ""}`}
                    title="Masquer"
                    onClick={() => prefs.toggleModule(mod.id, "visible")}
                  >
                    <EyeOff size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ═══════ 5. NOTIFICATIONS ═══════ */}
          <section id="sec-notifications" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Notifications</h3>
              <p className="sp-section__sub">Gérez vos alertes et rappels.</p>
            </div>
            <div className="sp-card">
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Zap size={15} /> Notifications push
                  </span>
                  <span className="sp-row__desc">
                    Recevoir des notifications sur votre appareil
                  </span>
                </div>
                <Toggle
                  on={prefs.notifications.pushEnabled}
                  onChange={() =>
                    prefs.setNotification(
                      "pushEnabled",
                      !prefs.notifications.pushEnabled,
                    )
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Mail size={15} /> Notifications par e-mail
                  </span>
                  <span className="sp-row__desc">
                    Recevoir un résumé quotidien par e-mail
                  </span>
                </div>
                <Toggle
                  on={prefs.notifications.emailEnabled}
                  onChange={() =>
                    prefs.setNotification(
                      "emailEnabled",
                      !prefs.notifications.emailEnabled,
                    )
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Volume2 size={15} /> Sons de notification
                  </span>
                  <span className="sp-row__desc">
                    Jouer un son lors de la réception
                  </span>
                </div>
                <Toggle
                  on={prefs.notifications.soundEnabled}
                  onChange={() =>
                    prefs.setNotification(
                      "soundEnabled",
                      !prefs.notifications.soundEnabled,
                    )
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Train size={15} /> Alerte trajet
                  </span>
                  <span className="sp-row__desc">
                    Notification X min avant un départ suivi
                  </span>
                </div>
                <select
                  className="sp-select"
                  value={prefs.notifications.trajetAlertMinutes}
                  onChange={(e) =>
                    prefs.setNotification("trajetAlertMinutes", +e.target.value)
                  }
                >
                  <option value={0}>Désactivé</option>
                  <option value={5}>5 min</option>
                  <option value={10}>10 min</option>
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={60}>1 heure</option>
                </select>
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <ListTodo size={15} /> Rappels tâches
                  </span>
                  <span className="sp-row__desc">
                    Notification pour les todos à échéance
                  </span>
                </div>
                <Toggle
                  on={prefs.notifications.todoReminders}
                  onChange={() =>
                    prefs.setNotification(
                      "todoReminders",
                      !prefs.notifications.todoReminders,
                    )
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <BedDouble size={15} /> Rappel sommeil
                  </span>
                  <span className="sp-row__desc">
                    Heure du rappel "Il est l'heure de dormir"
                  </span>
                </div>
                <input
                  type="time"
                  className="sp-input sp-input--time"
                  value={prefs.notifications.sleepReminderTime}
                  onChange={(e) =>
                    prefs.setNotification("sleepReminderTime", e.target.value)
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Sunrise size={15} /> Résumé matinal
                  </span>
                  <span className="sp-row__desc">
                    Récap chaque matin : tâches, météo, trajet
                  </span>
                </div>
                <Toggle
                  on={prefs.notifications.morningSummary}
                  onChange={() =>
                    prefs.setNotification(
                      "morningSummary",
                      !prefs.notifications.morningSummary,
                    )
                  }
                />
              </div>
            </div>
          </section>

          {/* ═══════ 6. BEHAVIOR ═══════ */}
          <section id="sec-behavior" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Comportement</h3>
              <p className="sp-section__sub">
                Configurez le comportement général de l'app.
              </p>
            </div>
            <div className="sp-card">
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Page par défaut</span>
                  <span className="sp-row__desc">
                    Page affichée au lancement
                  </span>
                </div>
                <Select
                  value={prefs.defaultPage}
                  options={
                    [
                      "/",
                      "/todos",
                      "/budget",
                      "/transport",
                      "/recipes",
                      "/sleep",
                      "/work",
                    ] as DefaultPage[]
                  }
                  labels={{
                    "/": "Accueil",
                    "/todos": "To-do",
                    "/budget": "Budget",
                    "/transport": "Transport",
                    "/recipes": "Recettes",
                    "/sleep": "Sommeil",
                    "/work": "Travail",
                  }}
                  onChange={(v) => prefs.set("defaultPage", v)}
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Globe size={15} /> Langue
                  </span>
                  <span className="sp-row__desc">Langue de l'interface</span>
                </div>
                <Select
                  value={prefs.language}
                  options={["fr", "en"] as Language[]}
                  labels={{ fr: "Français", en: "English" }}
                  onChange={(v) => prefs.set("language", v)}
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Clock size={15} /> Format horaire
                  </span>
                  <span className="sp-row__desc">Affichage des heures</span>
                </div>
                <Select
                  value={prefs.timeFormat}
                  options={["24h", "12h"] as TimeFormat[]}
                  labels={{ "24h": "24 heures", "12h": "12h AM/PM" }}
                  onChange={(v) => prefs.set("timeFormat", v)}
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Calendar size={15} /> Premier jour de la semaine
                  </span>
                  <span className="sp-row__desc">Lundi ou dimanche</span>
                </div>
                <Select
                  value={prefs.firstDay}
                  options={["monday", "sunday"] as FirstDay[]}
                  labels={{ monday: "Lundi", sunday: "Dimanche" }}
                  onChange={(v) => prefs.set("firstDay", v)}
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Coins size={15} /> Devise
                  </span>
                  <span className="sp-row__desc">
                    Symbole monétaire pour le budget
                  </span>
                </div>
                <Select
                  value={prefs.currency}
                  options={["EUR", "USD", "GBP"] as Currency[]}
                  labels={{ EUR: "€ Euro", USD: "$ Dollar", GBP: "£ Livre" }}
                  onChange={(v) => prefs.set("currency", v)}
                />
              </div>
            </div>
          </section>

          {/* ═══════ 7. DATA & PRIVACY ═══════ */}
          <section id="sec-privacy" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Données & confidentialité</h3>
              <p className="sp-section__sub">
                Contrôlez vos données et votre vie privée.
              </p>
            </div>
            <div className="sp-card">
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Données analytiques</span>
                  <span className="sp-row__desc">
                    Partager des données anonymes pour améliorer l'app
                  </span>
                </div>
                <Toggle
                  on={prefs.analyticsEnabled}
                  onChange={() =>
                    prefs.set("analyticsEnabled", !prefs.analyticsEnabled)
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Localisation</span>
                  <span className="sp-row__desc">
                    Autoriser l'accès à votre position GPS
                  </span>
                </div>
                <Toggle
                  on={prefs.locationEnabled}
                  onChange={() =>
                    prefs.set("locationEnabled", !prefs.locationEnabled)
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    Historique de navigation
                  </span>
                  <span className="sp-row__desc">
                    Sauvegarder l'historique de vos recherches
                  </span>
                </div>
                <Toggle
                  on={prefs.historyEnabled}
                  onChange={() =>
                    prefs.set("historyEnabled", !prefs.historyEnabled)
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Durée de rétention</span>
                  <span className="sp-row__desc">
                    Supprimer automatiquement les données anciennes
                  </span>
                </div>
                <select
                  className="sp-select"
                  value={prefs.retentionMonths}
                  onChange={(e) =>
                    prefs.set("retentionMonths", +e.target.value)
                  }
                >
                  <option value={0}>Illimité</option>
                  <option value={1}>1 mois</option>
                  <option value={3}>3 mois</option>
                  <option value={6}>6 mois</option>
                  <option value={12}>1 an</option>
                </select>
              </div>

              <div className="sp-row__actions">
                <button
                  className="sp-btn sp-btn--outline"
                  onClick={handleExport}
                >
                  <Download size={15} /> Exporter mes données (JSON)
                </button>
              </div>

              <div className="sp-row__actions">
                <button
                  className="sp-btn sp-btn--outline sp-btn--sm"
                  onClick={() => prefs.clearModuleData("budget")}
                >
                  Effacer Budget
                </button>
                <button
                  className="sp-btn sp-btn--outline sp-btn--sm"
                  onClick={() => prefs.clearModuleData("todos")}
                >
                  Effacer To-do
                </button>
                <button
                  className="sp-btn sp-btn--outline sp-btn--sm"
                  onClick={() => prefs.clearModuleData("sleep")}
                >
                  Effacer Sommeil
                </button>
                <button
                  className="sp-btn sp-btn--outline sp-btn--sm"
                  onClick={() => prefs.clearModuleData("transport")}
                >
                  Effacer Transport
                </button>
                <button
                  className="sp-btn sp-btn--outline sp-btn--sm"
                  onClick={() => prefs.clearModuleData("recipes")}
                >
                  Effacer Recettes
                </button>
                <button
                  className="sp-btn sp-btn--outline sp-btn--sm"
                  onClick={() => prefs.clearModuleData("work")}
                >
                  Effacer Travail
                </button>
              </div>

              <div className="sp-row__actions">
                <button
                  className="sp-btn sp-btn--danger"
                  onClick={() =>
                    setConfirmDialog({
                      title: "Effacer toutes les données",
                      description:
                        "Toutes vos données seront supprimées. Cette action est irréversible.",
                      action: () => prefs.clearAllData(),
                    })
                  }
                >
                  <Trash2 size={15} /> Effacer toutes les données
                </button>
              </div>
            </div>
          </section>

          {/* ═══════ 8. ACCESSIBILITY ═══════ */}
          <section id="sec-accessibility" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Accessibilité</h3>
              <p className="sp-section__sub">
                Adaptez l'interface à vos besoins.
              </p>
            </div>
            <div className="sp-card">
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Réduire les animations</span>
                  <span className="sp-row__desc">
                    Désactiver les transitions de l'interface
                  </span>
                </div>
                <Toggle
                  on={prefs.reduceAnimations}
                  onChange={() =>
                    prefs.set("reduceAnimations", !prefs.reduceAnimations)
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Contraste élevé</span>
                  <span className="sp-row__desc">
                    Augmenter le contraste des couleurs
                  </span>
                </div>
                <Toggle
                  on={prefs.highContrast}
                  onChange={() =>
                    prefs.set("highContrast", !prefs.highContrast)
                  }
                />
              </div>
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">Mode hors-ligne</span>
                  <span className="sp-row__desc">
                    Cache agressif des données pour utilisation sans réseau
                  </span>
                </div>
                <Toggle
                  on={prefs.offlineMode}
                  onChange={() => prefs.set("offlineMode", !prefs.offlineMode)}
                />
              </div>

              {/* Colorblind / Daltonisme */}
              <div className="sp-row sp-row--col">
                <div className="sp-row__text">
                  <span className="sp-row__label">Daltonisme</span>
                  <span className="sp-row__desc">
                    Adapte les couleurs et ajoute des indicateurs visuels pour
                    les personnes atteintes de daltonisme.
                  </span>
                </div>
                <div className="sp-cb-modes">
                  {(
                    [
                      {
                        value: "none",
                        label: "Désactivé",
                        desc: "Vision normale",
                      },
                      {
                        value: "protanopia",
                        label: "Protanopie",
                        desc: "Insensibilité au rouge",
                      },
                      {
                        value: "deuteranopia",
                        label: "Deutéranopie",
                        desc: "Insensibilité au vert",
                      },
                      {
                        value: "tritanopia",
                        label: "Tritanopie",
                        desc: "Insensibilité au bleu",
                      },
                    ] as {
                      value: ColorblindMode;
                      label: string;
                      desc: string;
                    }[]
                  ).map((mode) => (
                    <button
                      key={mode.value}
                      className={`sp-cb-mode ${
                        prefs.colorblindMode === mode.value
                          ? "sp-cb-mode--active"
                          : ""
                      }`}
                      onClick={() => prefs.set("colorblindMode", mode.value)}
                    >
                      <span className="sp-cb-mode__label">{mode.label}</span>
                      <span className="sp-cb-mode__desc">{mode.desc}</span>
                      {mode.value !== "none" && (
                        <span
                          className={`sp-cb-mode__preview sp-cb-mode__preview--${mode.value}`}
                        >
                          <span className="sp-cb-dot sp-cb-dot--1" />
                          <span className="sp-cb-dot sp-cb-dot--2" />
                          <span className="sp-cb-dot sp-cb-dot--3" />
                        </span>
                      )}
                      {prefs.colorblindMode === mode.value && (
                        <Check size={16} className="sp-cb-mode__check" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ═══════ 9. SECURITY ═══════ */}
          <section id="sec-security" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Sécurité</h3>
              <p className="sp-section__sub">
                Protégez l'accès à votre application.
              </p>
            </div>
            <div className="sp-card">
              {/* PIN toggle */}
              <div className="sp-row">
                <div className="sp-row__text">
                  <span className="sp-row__label">
                    <Lock size={15} /> Verrouillage par PIN
                  </span>
                  <span className="sp-row__desc">
                    {auth.user?.pin
                      ? auth.user.lock_selection.length === 0
                        ? "Activé — code PIN requis au lancement"
                        : "Activé — modules sélectionnés verrouillés"
                      : "Désactivé"}
                  </span>
                </div>
                {auth.user?.pin ? (
                  <button
                    className="sp-btn sp-btn--outline sp-btn--sm"
                    onClick={() => {
                      // If pin_code is empty (corrupted state), disable directly
                      if (!auth.user?.pin_code) {
                        auth.disablePin();
                        return;
                      }
                      setPinDisableVerify(true);
                      setPinDraft("");
                      setPinError("");
                    }}
                  >
                    Désactiver
                  </button>
                ) : (
                  <button
                    className="sp-btn sp-btn--outline sp-btn--sm"
                    onClick={() => {
                      setPinSetup({ step: "new", code: "" });
                      setPinDraft("");
                      setPinError("");
                    }}
                  >
                    Configurer
                  </button>
                )}
              </div>

              {/* PIN disable verification */}
              {pinDisableVerify && (
                <div className="sp-pin-setup">
                  <p className="sp-pin-setup__label">
                    Entrez votre code PIN pour désactiver :
                  </p>
                  <input
                    className="sp-input sp-input--pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={pinDraft}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setPinDraft(val);
                      setPinError("");
                    }}
                    placeholder="• • • • • •"
                    autoFocus
                  />
                  {pinError && <p className="sp-pin-setup__err">{pinError}</p>}
                  <div className="sp-pin-setup__actions">
                    <button
                      className="sp-btn sp-btn--outline sp-btn--sm"
                      onClick={() => {
                        setPinDisableVerify(false);
                        setPinDraft("");
                        setPinError("");
                      }}
                    >
                      Annuler
                    </button>
                    <button
                      className="sp-btn sp-btn--primary sp-btn--sm"
                      disabled={pinDraft.length < 4}
                      onClick={() => {
                        if (pinDraft === auth.user?.pin_code) {
                          auth.disablePin();
                          setPinDisableVerify(false);
                          setPinDraft("");
                        } else {
                          setPinError("Code PIN incorrect");
                          setPinDraft("");
                        }
                      }}
                    >
                      Confirmer
                    </button>
                  </div>
                </div>
              )}

              {/* PIN setup flow */}
              {pinSetup && (
                <div className="sp-pin-setup">
                  <p className="sp-pin-setup__label">
                    {pinSetup.step === "new"
                      ? "Définissez un code à 6 chiffres :"
                      : "Confirmez votre code :"}
                  </p>
                  <input
                    className="sp-input sp-input--pin"
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={pinDraft}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                      setPinDraft(val);
                      setPinError("");
                    }}
                    placeholder="• • • • • •"
                    autoFocus
                  />
                  {pinError && <p className="sp-pin-setup__err">{pinError}</p>}
                  <div className="sp-pin-setup__actions">
                    <button
                      className="sp-btn sp-btn--outline sp-btn--sm"
                      onClick={() => setPinSetup(null)}
                    >
                      Annuler
                    </button>
                    <button
                      className="sp-btn sp-btn--primary sp-btn--sm"
                      disabled={pinDraft.length < 6}
                      onClick={() => {
                        if (pinSetup.step === "new") {
                          setPinSetup({ step: "confirm", code: pinDraft });
                          setPinDraft("");
                        } else {
                          if (pinDraft === pinSetup.code) {
                            auth.enablePin(pinDraft);
                            setPinSetup(null);
                          } else {
                            setPinError("Les codes ne correspondent pas");
                            setPinDraft("");
                          }
                        }
                      }}
                    >
                      {pinSetup.step === "new" ? "Suivant" : "Activer"}
                    </button>
                  </div>
                </div>
              )}

              {/* Locked modules selector */}
              {auth.user?.pin && (
                <div className="sp-row sp-row--col" style={{ marginTop: 8 }}>
                  <div className="sp-row__text">
                    <span className="sp-row__label">
                      <EyeOff size={15} /> Modules verrouillés
                    </span>
                    <span className="sp-row__desc">
                      Sélectionnez les modules à protéger. Si aucun n'est
                      sélectionné, l'application entière est verrouillée.
                    </span>
                  </div>
                  <div className="sp-hidden-mods">
                    {prefs.modules.map((mod) => (
                      <button
                        key={mod.id}
                        className={`sp-chip ${auth.user?.lock_selection.includes(mod.id) ? "sp-chip--active" : ""}`}
                        onClick={() => {
                          const current = auth.user?.lock_selection ?? [];
                          const next = current.includes(mod.id)
                            ? current.filter((m) => m !== mod.id)
                            : [...current, mod.id];
                          auth.updateLockSelection(next);
                        }}
                      >
                        {getModuleEmoji(mod.id)} {getModuleLabel(mod.id)}
                        {auth.user?.lock_selection.includes(mod.id) && (
                          <Check size={12} />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="sp-row__hint">
                    {auth.user.lock_selection.length === 0
                      ? "Aucun module sélectionné — le code PIN est demandé à chaque ouverture du site."
                      : "Seuls les modules sélectionnés sont verrouillés. Une fois le PIN saisi, tous sont déverrouillés jusqu'à la prochaine actualisation."}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ═══════ 10. PROFILES ═══════ */}
          <section id="sec-profiles" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Profils</h3>
              <p className="sp-section__sub">
                Basculez entre "Travail" et "Perso" avec des configurations
                différentes.
              </p>
            </div>
            <div className="sp-card">
              {prefs.profiles.map((p) => (
                <div
                  key={p.id}
                  className={`sp-row ${prefs.activeProfileId === p.id ? "sp-row--highlight" : ""}`}
                >
                  <span className="sp-row__emoji">{p.emoji}</span>
                  <div className="sp-row__text" style={{ flex: 1 }}>
                    <span className="sp-row__label">{p.name}</span>
                    {prefs.activeProfileId === p.id && (
                      <span className="sp-row__desc">Actif</span>
                    )}
                  </div>
                  {prefs.activeProfileId !== p.id && (
                    <>
                      <button
                        className="sp-btn sp-btn--outline sp-btn--sm"
                        onClick={() => prefs.switchProfile(p.id)}
                      >
                        Activer
                      </button>
                      {p.id !== "default" && (
                        <button
                          className="sp-icon-btn"
                          onClick={() => prefs.removeProfile(p.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </>
                  )}
                  {prefs.activeProfileId === p.id && (
                    <Check
                      size={16}
                      style={{ color: "var(--d-accent, #6366f1)" }}
                    />
                  )}
                </div>
              ))}

              {/* New profile */}
              <div className="sp-row sp-row--col" style={{ marginTop: 12 }}>
                <div className="sp-new-profile">
                  <input
                    className="sp-emoji-input"
                    maxLength={2}
                    value={newProfileEmoji}
                    onChange={(e) => setNewProfileEmoji(e.target.value)}
                    style={{ width: 40, textAlign: "center" }}
                  />
                  <input
                    className="sp-input"
                    placeholder="Nom du profil…"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    className="sp-btn sp-btn--primary sp-btn--sm"
                    disabled={!newProfileName.trim()}
                    onClick={() => {
                      prefs.addProfile(
                        newProfileName.trim(),
                        newProfileEmoji || "📌",
                      );
                      setNewProfileName("");
                      setNewProfileEmoji("🏢");
                    }}
                  >
                    <Plus size={14} /> Ajouter
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* ═══════ 11. STORAGE ═══════ */}
          <section id="sec-storage" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Stockage</h3>
              <p className="sp-section__sub">
                Espace utilisé par l'application dans le navigateur.
              </p>
            </div>
            <div className="sp-card">
              <p className="sp-storage-total">
                Données localStorage : ~
                {(JSON.stringify(localStorage).length / 1024).toFixed(1)} Ko
              </p>
              <div className="sp-row__actions">
                <button
                  className="sp-btn sp-btn--danger"
                  onClick={() =>
                    setConfirmDialog({
                      title: "Vider tout le cache",
                      description:
                        "Toutes les données en cache seront supprimées.",
                      action: () => prefs.clearAllData(),
                    })
                  }
                >
                  <Trash2 size={15} /> Vider tout le cache
                </button>
              </div>
            </div>
          </section>

          {/* ═══════ 12. ABOUT ═══════ */}
          <section id="sec-about" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">À propos</h3>
              <p className="sp-section__sub">Informations sur l'application.</p>
            </div>
            <div className="sp-card">
              <div className="sp-about">
                <div className="sp-about__row">
                  <span className="sp-about__label">Version</span>
                  <span className="sp-about__value">
                    1.0.0 (build 2026.03.09)
                  </span>
                </div>
                <div className="sp-about__row">
                  <span className="sp-about__label">Plateforme</span>
                  <span className="sp-about__value">Web</span>
                </div>
                <div className="sp-about__row">
                  <span className="sp-about__label">Licence</span>
                  <span className="sp-about__value">
                    Propriétaire — Daylence SAS
                  </span>
                </div>
                <div className="sp-about__row">
                  <span className="sp-about__label">Contact</span>
                  <span className="sp-about__value">support@daylence.com</span>
                </div>
              </div>
              <div className="sp-row__actions" style={{ marginTop: 16 }}>
                <a href="/privacy-policy" className="sp-btn sp-btn--outline">
                  Politique de confidentialité
                </a>
                <a href="/confidentiality" className="sp-btn sp-btn--outline">
                  Conditions d'utilisation
                </a>
              </div>
              <div className="sp-row__actions" style={{ marginTop: 8 }}>
                <button
                  className="sp-btn sp-btn--outline"
                  onClick={() => {
                    prefs.resetToDefaults();
                  }}
                >
                  <RotateCcw size={14} /> Réinitialiser tous les paramètres
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="sp-footer">
        <span className="sp-footer__copy">
          &copy; {new Date().getFullYear()} Daylence
        </span>
        <div className="sp-footer__links">
          <a href="/privacy-policy">Confidentialité</a>
          <a href="/support">Aide</a>
        </div>
      </footer>

      <ConfirmDialog
        open={!!confirmDialog}
        title={confirmDialog?.title ?? ""}
        description={confirmDialog?.description}
        confirmLabel="Supprimer"
        variant="danger"
        onConfirm={() => confirmDialog?.action()}
        onCancel={() => setConfirmDialog(null)}
      />
    </div>
  );
}

/* ── Helpers ── */

function getModuleEmoji(id: string) {
  const m: Record<string, string> = {
    recipes: "🍳",
    sleep: "😴",
    transport: "🚆",
    budget: "💰",
    work: "💼",
    todos: "✅",
    appblock: "🔒",
  };
  return m[id] ?? "📦";
}

function getModuleLabel(id: string) {
  const m: Record<string, string> = {
    recipes: "Recettes",
    sleep: "Sommeil",
    transport: "Transport",
    budget: "Budget",
    work: "Travail",
    todos: "To-do",
    appblock: "Bloqueur",
  };
  return m[id] ?? id;
}
