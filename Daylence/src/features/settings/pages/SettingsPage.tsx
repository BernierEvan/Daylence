import { useState } from "react";
import "../css/SettingsProfile.css";

interface ToggleOption {
  id: string;
  label: string;
  description: string;
  defaultValue: boolean;
}

interface SelectOption {
  id: string;
  label: string;
  description: string;
  options: string[];
  defaultValue: string;
}

const notificationToggles: ToggleOption[] = [
  { id: "notif-push", label: "Notifications push", description: "Recevoir des notifications sur votre appareil", defaultValue: true },
  { id: "notif-email", label: "Notifications par e-mail", description: "Recevoir un résumé quotidien par e-mail", defaultValue: false },
  { id: "notif-sound", label: "Sons de notification", description: "Jouer un son lors de la réception d'une notification", defaultValue: true },
  { id: "notif-transport", label: "Alertes transport", description: "Notifications de retards et perturbations", defaultValue: true },
];

const privacyToggles: ToggleOption[] = [
  { id: "priv-analytics", label: "Données analytiques", description: "Partager des données anonymes pour améliorer l'app", defaultValue: true },
  { id: "priv-location", label: "Localisation", description: "Autoriser l'accès à votre position GPS", defaultValue: false },
  { id: "priv-history", label: "Historique de navigation", description: "Sauvegarder l'historique de vos recherches", defaultValue: true },
];

const displaySelects: SelectOption[] = [
  { id: "disp-theme", label: "Thème", description: "Apparence de l'application", options: ["Clair", "Sombre", "Système"], defaultValue: "Clair" },
  { id: "disp-lang", label: "Langue", description: "Langue de l'interface", options: ["Français", "English", "Español", "Deutsch"], defaultValue: "Français" },
  { id: "disp-font", label: "Taille du texte", description: "Taille de police de l'interface", options: ["Petit", "Normal", "Grand", "Très grand"], defaultValue: "Normal" },
];

const accessibilityToggles: ToggleOption[] = [
  { id: "a11y-reduce-motion", label: "Réduire les animations", description: "Désactiver les animations de l'interface", defaultValue: false },
  { id: "a11y-high-contrast", label: "Contraste élevé", description: "Augmenter le contraste des couleurs", defaultValue: false },
  { id: "a11y-screen-reader", label: "Lecteur d'écran", description: "Optimiser pour les technologies d'assistance", defaultValue: false },
];

const storageItems = [
  { label: "Cache de l'application", size: "24.3 Mo", color: "#3b82f6" },
  { label: "Images téléchargées", size: "12.1 Mo", color: "#22c55e" },
  { label: "Données hors-ligne", size: "8.7 Mo", color: "#f59e0b" },
  { label: "Historique", size: "2.4 Mo", color: "#ef4444" },
];

export default function SettingsPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    [...notificationToggles, ...privacyToggles, ...accessibilityToggles].forEach((t) => {
      init[t.id] = t.defaultValue;
    });
    return init;
  });

  const [selects, setSelects] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    displaySelects.forEach((s) => {
      init[s.id] = s.defaultValue;
    });
    return init;
  });

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (id: string, value: string) => {
    setSelects((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="sp-page">
      {/* Header */}
      <header className="sp-header">
        <a href="/" className="sp-header__brand">
          <img src="/daylence_logo_without_title.png" alt="Daylence" className="sp-header__logo" />
          <span className="sp-header__title">Daylence</span>
        </a>
        <nav className="sp-header__nav">
          <a href="/" className="sp-header__link">Accueil</a>
          <a href="/profile" className="sp-header__link">Mon Profil</a>
        </nav>
      </header>

      {/* Content */}
      <main className="sp-main">
        <div className="sp-sidebar">
          <h2 className="sp-sidebar__title">Paramètres</h2>
          <nav className="sp-sidebar__nav">
            <a href="#notifications" className="sp-sidebar__link sp-sidebar__link--active">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              Notifications
            </a>
            <a href="#display" className="sp-sidebar__link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              Affichage
            </a>
            <a href="#privacy" className="sp-sidebar__link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Confidentialité
            </a>
            <a href="#accessibility" className="sp-sidebar__link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
              Accessibilité
            </a>
            <a href="#storage" className="sp-sidebar__link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
              Stockage
            </a>
            <a href="#about" className="sp-sidebar__link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              À propos
            </a>
          </nav>
        </div>

        <div className="sp-content">
          {/* Notifications */}
          <section id="notifications" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Notifications</h3>
              <p className="sp-section__sub">Gérez comment et quand vous recevez des alertes.</p>
            </div>
            <div className="sp-card">
              {notificationToggles.map((t) => (
                <div key={t.id} className="sp-row">
                  <div className="sp-row__text">
                    <span className="sp-row__label">{t.label}</span>
                    <span className="sp-row__desc">{t.description}</span>
                  </div>
                  <button
                    className={`sp-toggle ${toggles[t.id] ? "sp-toggle--on" : ""}`}
                    onClick={() => handleToggle(t.id)}
                    aria-label={t.label}
                  >
                    <span className="sp-toggle__thumb" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Display */}
          <section id="display" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Affichage</h3>
              <p className="sp-section__sub">Personnalisez l'apparence de votre application.</p>
            </div>
            <div className="sp-card">
              {displaySelects.map((s) => (
                <div key={s.id} className="sp-row">
                  <div className="sp-row__text">
                    <span className="sp-row__label">{s.label}</span>
                    <span className="sp-row__desc">{s.description}</span>
                  </div>
                  <select
                    className="sp-select"
                    value={selects[s.id]}
                    onChange={(e) => handleSelect(s.id, e.target.value)}
                  >
                    {s.options.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Confidentialité</h3>
              <p className="sp-section__sub">Contrôlez vos données et votre vie privée.</p>
            </div>
            <div className="sp-card">
              {privacyToggles.map((t) => (
                <div key={t.id} className="sp-row">
                  <div className="sp-row__text">
                    <span className="sp-row__label">{t.label}</span>
                    <span className="sp-row__desc">{t.description}</span>
                  </div>
                  <button
                    className={`sp-toggle ${toggles[t.id] ? "sp-toggle--on" : ""}`}
                    onClick={() => handleToggle(t.id)}
                    aria-label={t.label}
                  >
                    <span className="sp-toggle__thumb" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Accessibility */}
          <section id="accessibility" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Accessibilité</h3>
              <p className="sp-section__sub">Adaptez l'interface à vos besoins.</p>
            </div>
            <div className="sp-card">
              {accessibilityToggles.map((t) => (
                <div key={t.id} className="sp-row">
                  <div className="sp-row__text">
                    <span className="sp-row__label">{t.label}</span>
                    <span className="sp-row__desc">{t.description}</span>
                  </div>
                  <button
                    className={`sp-toggle ${toggles[t.id] ? "sp-toggle--on" : ""}`}
                    onClick={() => handleToggle(t.id)}
                    aria-label={t.label}
                  >
                    <span className="sp-toggle__thumb" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Storage */}
          <section id="storage" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">Stockage</h3>
              <p className="sp-section__sub">Gérez l'espace utilisé par l'application.</p>
            </div>
            <div className="sp-card">
              <div className="sp-storage-bar">
                {storageItems.map((s) => (
                  <div key={s.label} className="sp-storage-bar__segment" style={{ background: s.color, flex: parseFloat(s.size) }} />
                ))}
              </div>
              <p className="sp-storage-total">47.5 Mo utilisés sur 500 Mo</p>
              {storageItems.map((s) => (
                <div key={s.label} className="sp-row sp-row--compact">
                  <div className="sp-row__text">
                    <span className="sp-row__label">
                      <span className="sp-storage-dot" style={{ background: s.color }} />
                      {s.label}
                    </span>
                    <span className="sp-row__desc">{s.size}</span>
                  </div>
                  <button className="sp-btn sp-btn--outline sp-btn--sm">Vider</button>
                </div>
              ))}
              <div className="sp-row__actions">
                <button className="sp-btn sp-btn--danger">Vider tout le cache</button>
              </div>
            </div>
          </section>

          {/* About */}
          <section id="about" className="sp-section">
            <div className="sp-section__header">
              <h3 className="sp-section__title">À propos</h3>
              <p className="sp-section__sub">Informations sur l'application.</p>
            </div>
            <div className="sp-card">
              <div className="sp-about">
                <div className="sp-about__row">
                  <span className="sp-about__label">Version</span>
                  <span className="sp-about__value">1.0.0 (build 2026.03.03)</span>
                </div>
                <div className="sp-about__row">
                  <span className="sp-about__label">Plateforme</span>
                  <span className="sp-about__value">Web</span>
                </div>
                <div className="sp-about__row">
                  <span className="sp-about__label">Licence</span>
                  <span className="sp-about__value">Propriétaire — Daylence SAS</span>
                </div>
                <div className="sp-about__row">
                  <span className="sp-about__label">Contact</span>
                  <span className="sp-about__value">support@daylence.com</span>
                </div>
              </div>
              <div className="sp-row__actions" style={{ marginTop: 16 }}>
                <a href="/privacy-policy" className="sp-btn sp-btn--outline">Politique de confidentialité</a>
                <a href="/confidentiality" className="sp-btn sp-btn--outline">Conditions d'utilisation</a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="sp-footer">
        <span className="sp-footer__copy">&copy; {new Date().getFullYear()} Daylence</span>
        <div className="sp-footer__links">
          <a href="/privacy-policy">Confidentialité</a>
          <a href="/support">Aide</a>
        </div>
      </footer>
    </div>
  );
}
