import { useState } from "react";
import {
  Bell,
  Monitor,
  Shield,
  Accessibility,
  Database,
  Info,
  ArrowLeft,
  Sun,
  Moon,
  Globe,
  Type,
} from "lucide-react";
import "../css/SettingsProfile.css";

type Section =
  | "notifications"
  | "display"
  | "privacy"
  | "accessibility"
  | "storage"
  | "about";

const NAV_ITEMS: { key: Section; label: string; icon: React.ReactNode }[] = [
  { key: "notifications", label: "Notifications", icon: <Bell size={18} /> },
  { key: "display", label: "Affichage", icon: <Monitor size={18} /> },
  { key: "privacy", label: "Confidentialité", icon: <Shield size={18} /> },
  {
    key: "accessibility",
    label: "Accessibilité",
    icon: <Accessibility size={18} />,
  },
  { key: "storage", label: "Stockage", icon: <Database size={18} /> },
  { key: "about", label: "À propos", icon: <Info size={18} /> },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      className={`sp-toggle ${checked ? "sp-toggle--on" : ""}`}
      onClick={onChange}
    >
      <span className="sp-toggle__knob" />
    </button>
  );
}

export default function SettingsPage() {
  const [active, setActive] = useState<Section>("notifications");

  // Toggle state helpers
  const [notifs, setNotifs] = useState({
    push: true,
    email: false,
    sound: true,
    badge: true,
  });
  const [display, setDisplay] = useState({
    theme: "system",
    language: "fr",
    fontSize: "medium",
  });
  const [privacy, setPrivacy] = useState({
    analytics: true,
    crashes: true,
    personalized: false,
  });
  const [a11y, setA11y] = useState({
    reduceMotion: false,
    highContrast: false,
    screenReader: false,
  });

  const storageItems = [
    { label: "Cache", size: "24 Mo", pct: 30, color: "#6c5ce7" },
    { label: "Données", size: "58 Mo", pct: 58, color: "#3b82f6" },
    { label: "Médias", size: "112 Mo", pct: 80, color: "#f59e0b" },
    { label: "Autre", size: "6 Mo", pct: 5, color: "#888" },
  ];

  return (
    <div className="sp-page">
      {/* Header */}
      <header className="sp-header">
        <a href="/" className="sp-header__brand">
          <img
            src="/daylence_logo_without_title.png"
            alt="Daylence"
            className="sp-header__logo"
          />
          <span className="sp-header__title">Daylence</span>
        </a>
        <nav className="sp-header__nav">
          <a href="/" className="sp-header__link">
            Accueil
          </a>
          <a href="/discover" className="sp-header__link">
            Découvrir
          </a>
          <a href="/support" className="sp-header__link">
            Support
          </a>
        </nav>
      </header>

      <div className="sp-layout">
        {/* Sidebar */}
        <aside className="sp-sidebar">
          <a href="/" className="sp-back">
            <ArrowLeft size={16} /> Retour
          </a>
          <h2 className="sp-sidebar__title">Paramètres</h2>
          <nav className="sp-sidebar__nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                className={`sp-sidebar__btn ${active === item.key ? "sp-sidebar__btn--active" : ""}`}
                onClick={() => setActive(item.key)}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="sp-main">
          {/* ── Notifications ── */}
          {active === "notifications" && (
            <section className="sp-section">
              <h2 className="sp-section__title">
                <Bell size={20} /> Notifications
              </h2>
              <div className="sp-card">
                <div className="sp-row">
                  <div>
                    <strong>Notifications push</strong>
                    <p className="sp-row__desc">
                      Recevoir des alertes en temps réel
                    </p>
                  </div>
                  <Toggle
                    checked={notifs.push}
                    onChange={() =>
                      setNotifs({ ...notifs, push: !notifs.push })
                    }
                  />
                </div>
                <div className="sp-row">
                  <div>
                    <strong>Notifications email</strong>
                    <p className="sp-row__desc">
                      Résumé hebdomadaire par email
                    </p>
                  </div>
                  <Toggle
                    checked={notifs.email}
                    onChange={() =>
                      setNotifs({ ...notifs, email: !notifs.email })
                    }
                  />
                </div>
                <div className="sp-row">
                  <div>
                    <strong>Sons</strong>
                    <p className="sp-row__desc">
                      Jouer un son pour chaque notification
                    </p>
                  </div>
                  <Toggle
                    checked={notifs.sound}
                    onChange={() =>
                      setNotifs({ ...notifs, sound: !notifs.sound })
                    }
                  />
                </div>
                <div className="sp-row">
                  <div>
                    <strong>Badge sur l'icône</strong>
                    <p className="sp-row__desc">
                      Afficher le compteur de notifications
                    </p>
                  </div>
                  <Toggle
                    checked={notifs.badge}
                    onChange={() =>
                      setNotifs({ ...notifs, badge: !notifs.badge })
                    }
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Display ── */}
          {active === "display" && (
            <section className="sp-section">
              <h2 className="sp-section__title">
                <Monitor size={20} /> Affichage
              </h2>
              <div className="sp-card">
                <div className="sp-row">
                  <div className="sp-row__label-group">
                    <Sun size={16} />
                    <Moon size={16} />
                    <strong>Thème</strong>
                  </div>
                  <select
                    className="sp-select"
                    value={display.theme}
                    onChange={(e) =>
                      setDisplay({ ...display, theme: e.target.value })
                    }
                  >
                    <option value="system">Système</option>
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                  </select>
                </div>
                <div className="sp-row">
                  <div className="sp-row__label-group">
                    <Globe size={16} />
                    <strong>Langue</strong>
                  </div>
                  <select
                    className="sp-select"
                    value={display.language}
                    onChange={(e) =>
                      setDisplay({ ...display, language: e.target.value })
                    }
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </div>
                <div className="sp-row">
                  <div className="sp-row__label-group">
                    <Type size={16} />
                    <strong>Taille du texte</strong>
                  </div>
                  <select
                    className="sp-select"
                    value={display.fontSize}
                    onChange={(e) =>
                      setDisplay({ ...display, fontSize: e.target.value })
                    }
                  >
                    <option value="small">Petit</option>
                    <option value="medium">Moyen</option>
                    <option value="large">Grand</option>
                  </select>
                </div>
              </div>
            </section>
          )}

          {/* ── Privacy ── */}
          {active === "privacy" && (
            <section className="sp-section">
              <h2 className="sp-section__title">
                <Shield size={20} /> Confidentialité
              </h2>
              <div className="sp-card">
                <div className="sp-row">
                  <div>
                    <strong>Données analytiques</strong>
                    <p className="sp-row__desc">
                      Partager des données d'usage anonymes
                    </p>
                  </div>
                  <Toggle
                    checked={privacy.analytics}
                    onChange={() =>
                      setPrivacy({ ...privacy, analytics: !privacy.analytics })
                    }
                  />
                </div>
                <div className="sp-row">
                  <div>
                    <strong>Rapports de crash</strong>
                    <p className="sp-row__desc">
                      Envoyer les rapports d'erreurs automatiquement
                    </p>
                  </div>
                  <Toggle
                    checked={privacy.crashes}
                    onChange={() =>
                      setPrivacy({ ...privacy, crashes: !privacy.crashes })
                    }
                  />
                </div>
                <div className="sp-row">
                  <div>
                    <strong>Contenu personnalisé</strong>
                    <p className="sp-row__desc">
                      Recommandations basées sur votre activité
                    </p>
                  </div>
                  <Toggle
                    checked={privacy.personalized}
                    onChange={() =>
                      setPrivacy({
                        ...privacy,
                        personalized: !privacy.personalized,
                      })
                    }
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Accessibility ── */}
          {active === "accessibility" && (
            <section className="sp-section">
              <h2 className="sp-section__title">
                <Accessibility size={20} /> Accessibilité
              </h2>
              <div className="sp-card">
                <div className="sp-row">
                  <div>
                    <strong>Réduire les animations</strong>
                    <p className="sp-row__desc">
                      Désactiver les transitions et animations
                    </p>
                  </div>
                  <Toggle
                    checked={a11y.reduceMotion}
                    onChange={() =>
                      setA11y({ ...a11y, reduceMotion: !a11y.reduceMotion })
                    }
                  />
                </div>
                <div className="sp-row">
                  <div>
                    <strong>Contraste élevé</strong>
                    <p className="sp-row__desc">
                      Augmenter le contraste des couleurs
                    </p>
                  </div>
                  <Toggle
                    checked={a11y.highContrast}
                    onChange={() =>
                      setA11y({ ...a11y, highContrast: !a11y.highContrast })
                    }
                  />
                </div>
                <div className="sp-row">
                  <div>
                    <strong>Lecteur d'écran</strong>
                    <p className="sp-row__desc">
                      Optimiser pour les lecteurs d'écran
                    </p>
                  </div>
                  <Toggle
                    checked={a11y.screenReader}
                    onChange={() =>
                      setA11y({ ...a11y, screenReader: !a11y.screenReader })
                    }
                  />
                </div>
              </div>
            </section>
          )}

          {/* ── Storage ── */}
          {active === "storage" && (
            <section className="sp-section">
              <h2 className="sp-section__title">
                <Database size={20} /> Stockage
              </h2>
              <div className="sp-card">
                <div className="sp-storage-bar">
                  {storageItems.map((s) => (
                    <div
                      key={s.label}
                      className="sp-storage-bar__seg"
                      style={{ flex: s.pct, backgroundColor: s.color }}
                      title={`${s.label}: ${s.size}`}
                    />
                  ))}
                </div>
                <p className="sp-storage-total">200 Mo utilisés sur 500 Mo</p>
                {storageItems.map((s) => (
                  <div className="sp-row" key={s.label}>
                    <div className="sp-row__label-group">
                      <span
                        className="sp-storage-dot"
                        style={{ backgroundColor: s.color }}
                      />
                      <strong>{s.label}</strong>
                    </div>
                    <span className="sp-storage-size">{s.size}</span>
                  </div>
                ))}
                <button
                  className="sp-btn sp-btn--danger"
                  style={{ marginTop: "0.75rem" }}
                >
                  Vider le cache
                </button>
              </div>
            </section>
          )}

          {/* ── About ── */}
          {active === "about" && (
            <section className="sp-section">
              <h2 className="sp-section__title">
                <Info size={20} /> À propos
              </h2>
              <div className="sp-card">
                <div className="sp-row">
                  <strong>Version</strong>
                  <span>1.0.0</span>
                </div>
                <div className="sp-row">
                  <strong>Plateforme</strong>
                  <span>Web</span>
                </div>
                <div className="sp-row">
                  <strong>Licence</strong>
                  <span>MIT</span>
                </div>
                <div className="sp-row">
                  <strong>Contact</strong>
                  <a href="mailto:support@daylence.com" className="sp-link">
                    support@daylence.com
                  </a>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="sp-footer">
        <div className="sp-footer__inner">
          <span>&copy; {new Date().getFullYear()} Daylence</span>
          <div className="sp-footer__links">
            <a href="/privacy-policy">Confidentialité</a>
            <a href="/support">Aide</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
