import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  MapPin,
  Mail,
  Phone,
  User,
  FileText,
  Award,
  TrendingUp,
  Calendar,
  Zap,
  Trash2,
  Download,
} from "lucide-react";
import "../css/SettingsProfile.css";

const BADGES = [
  { label: "Early Adopter", emoji: "🚀", color: "#6c5ce7" },
  { label: "Streak 7 jours", emoji: "🔥", color: "#ef4444" },
  { label: "Budget Master", emoji: "💰", color: "#22c55e" },
  { label: "Voyageur", emoji: "✈️", color: "#3b82f6" },
  { label: "Noctambule", emoji: "🌙", color: "#8b5cf6" },
  { label: "Sportif", emoji: "🏃", color: "#f59e0b" },
];

const STATS = [
  {
    label: "Jours actifs",
    value: "47",
    icon: <Calendar size={18} />,
    color: "#6c5ce7",
  },
  {
    label: "Tâches terminées",
    value: "183",
    icon: <TrendingUp size={18} />,
    color: "#22c55e",
  },
  {
    label: "Streak actuel",
    value: "12",
    icon: <Zap size={18} />,
    color: "#f59e0b",
  },
  {
    label: "Badges gagnés",
    value: "6",
    icon: <Award size={18} />,
    color: "#3b82f6",
  },
];

const ACTIVITY = [
  { text: "A complété 5 tâches", time: "Il y a 2h", icon: "✅" },
  { text: "Nouveau badge : Streak 7 jours", time: "Il y a 1 jour", icon: "🏆" },
  { text: "Budget mensuel mis à jour", time: "Il y a 2 jours", icon: "💰" },
  {
    text: "Itinéraire calculé : Paris → Lyon",
    time: "Il y a 3 jours",
    icon: "🚗",
  },
  { text: "Recette ajoutée aux favoris", time: "Il y a 5 jours", icon: "🍳" },
  { text: "Inscription à Daylence", time: "Il y a 47 jours", icon: "🎉" },
];

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: "Jean Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    bio: "Passionné de productivité et d'organisation. J'utilise Daylence au quotidien pour gérer mes tâches et mon budget.",
  });
  const [editing, setEditing] = useState(false);

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

      <div className="pf-wrapper">
        <a href="/" className="sp-back">
          <ArrowLeft size={16} /> Retour
        </a>

        {/* Hero banner */}
        <div className="pf-hero">
          <div className="pf-hero__gradient" />
          <div className="pf-hero__content">
            <div className="pf-avatar">
              <span className="pf-avatar__letter">{form.name.charAt(0)}</span>
              <button className="pf-avatar__edit">
                <Camera size={14} />
              </button>
            </div>
            <h1 className="pf-hero__name">{form.name}</h1>
            <p className="pf-hero__email">{form.email}</p>
          </div>
        </div>

        {/* Info form */}
        <section className="pf-section">
          <div className="pf-section__header">
            <h2>Informations personnelles</h2>
            <button
              className="sp-btn sp-btn--primary"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Sauvegarder" : "Modifier"}
            </button>
          </div>
          <div className="sp-card">
            <div className="pf-field">
              <label>
                <User size={14} /> Nom complet
              </label>
              <input
                disabled={!editing}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="pf-field">
              <label>
                <Mail size={14} /> Email
              </label>
              <input
                disabled={!editing}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="pf-field">
              <label>
                <Phone size={14} /> Téléphone
              </label>
              <input
                disabled={!editing}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="pf-field">
              <label>
                <MapPin size={14} /> Localisation
              </label>
              <input
                disabled={!editing}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div className="pf-field">
              <label>
                <FileText size={14} /> Bio
              </label>
              <textarea
                disabled={!editing}
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="pf-section">
          <h2>Badges</h2>
          <div className="pf-badges">
            {BADGES.map((b) => (
              <div
                key={b.label}
                className="pf-badge"
                style={{ borderColor: b.color }}
              >
                <span className="pf-badge__emoji">{b.emoji}</span>
                <span className="pf-badge__label">{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="pf-section">
          <h2>Statistiques</h2>
          <div className="pf-stats">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="pf-stat"
                style={{ borderLeftColor: s.color }}
              >
                <div className="pf-stat__icon" style={{ color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <span className="pf-stat__value">{s.value}</span>
                  <span className="pf-stat__label">{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity */}
        <section className="pf-section">
          <h2>Activité récente</h2>
          <div className="sp-card">
            {ACTIVITY.map((a, i) => (
              <div className="pf-activity" key={i}>
                <span className="pf-activity__icon">{a.icon}</span>
                <div className="pf-activity__info">
                  <span className="pf-activity__text">{a.text}</span>
                  <span className="pf-activity__time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Danger zone */}
        <section className="pf-section pf-danger">
          <h2>Zone de danger</h2>
          <div className="sp-card">
            <div className="sp-row">
              <div>
                <strong>Exporter mes données</strong>
                <p className="sp-row__desc">
                  Télécharger une copie de vos données
                </p>
              </div>
              <button className="sp-btn sp-btn--outline">
                <Download size={14} /> Exporter
              </button>
            </div>
            <div className="sp-row">
              <div>
                <strong>Supprimer mon compte</strong>
                <p className="sp-row__desc">
                  Action irréversible, toutes vos données seront supprimées
                </p>
              </div>
              <button className="sp-btn sp-btn--danger">
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        </section>
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
