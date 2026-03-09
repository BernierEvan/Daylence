import { useState } from "react";
import "../css/SettingsProfile.css";

interface Activity {
  icon: string;
  label: string;
  date: string;
  detail: string;
}

const recentActivity: Activity[] = [
  { icon: "🚗", label: "Itinéraire calculé", date: "Aujourd'hui, 14:32", detail: "Paris → Lyon en voiture" },
  { icon: "🍳", label: "Recette sauvegardée", date: "Hier, 19:15", detail: "Risotto aux champignons" },
  { icon: "😴", label: "Sommeil enregistré", date: "Hier, 07:00", detail: "7h42 — Score 85/100" },
  { icon: "💰", label: "Dépense ajoutée", date: "01 mars, 12:45", detail: "Courses — 47,30 €" },
  { icon: "✅", label: "Tâche terminée", date: "01 mars, 10:20", detail: "Finaliser la présentation Q1" },
  { icon: "🚆", label: "Trajet SNCF", date: "28 fév, 08:10", detail: "Marseille → Paris, TGV 6124" },
];

const stats = [
  { value: "142", label: "Tâches terminées", color: "#6c5ce7" },
  { value: "28", label: "Recettes essayées", color: "#f59e0b" },
  { value: "34", label: "Trajets calculés", color: "#3b82f6" },
  { value: "89%", label: "Score sommeil moyen", color: "#22c55e" },
];

const badges = [
  { emoji: "🏆", label: "Membre fondateur", color: "#f59e0b" },
  { emoji: "🔥", label: "7 jours consécutifs", color: "#ef4444" },
  { emoji: "🌟", label: "100 tâches", color: "#6c5ce7" },
  { emoji: "🚀", label: "Early adopter", color: "#3b82f6" },
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: "Bernardo",
    email: "bernardo@daylence.com",
    bio: "Passionné de productivité et d'organisation. J'utilise Daylence pour tout gérer au quotidien.",
    location: "Paris, France",
    phone: "+33 6 12 34 56 78",
  });

  const [editForm, setEditForm] = useState({ ...profile });

  const handleEdit = () => {
    setEditForm({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
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
          <a href="/parameters" className="sp-header__link">Paramètres</a>
        </nav>
      </header>

      {/* Content */}
      <main className="sp-main sp-main--profile">
        {/* Profile hero banner */}
        <div className="pf-hero">
          <div className="pf-hero__bg" />
          <div className="pf-hero__content">
            <div className="pf-avatar">
              <span className="pf-avatar__letter">{profile.displayName.charAt(0).toUpperCase()}</span>
              <button className="pf-avatar__edit" aria-label="Changer la photo">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
                </svg>
              </button>
            </div>
            <div className="pf-hero__info">
              <h1 className="pf-hero__name">{profile.displayName}</h1>
              <p className="pf-hero__email">{profile.email}</p>
              <p className="pf-hero__location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {profile.location}
              </p>
            </div>
            {!isEditing && (
              <button className="sp-btn sp-btn--white" onClick={handleEdit}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Modifier le profil
              </button>
            )}
          </div>
        </div>

        <div className="pf-body">
          {/* Left column */}
          <div className="pf-col pf-col--left">
            {/* Edit form or info card */}
            {isEditing ? (
              <section className="sp-section">
                <div className="sp-section__header">
                  <h3 className="sp-section__title">Modifier le profil</h3>
                </div>
                <div className="sp-card">
                  <div className="pf-form">
                    <label className="pf-form__label">
                      Nom d'affichage
                      <input
                        className="pf-form__input"
                        value={editForm.displayName}
                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                      />
                    </label>
                    <label className="pf-form__label">
                      E-mail
                      <input
                        className="pf-form__input"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </label>
                    <label className="pf-form__label">
                      Téléphone
                      <input
                        className="pf-form__input"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </label>
                    <label className="pf-form__label">
                      Localisation
                      <input
                        className="pf-form__input"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      />
                    </label>
                    <label className="pf-form__label">
                      Bio
                      <textarea
                        className="pf-form__textarea"
                        rows={3}
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      />
                    </label>
                    <div className="pf-form__actions">
                      <button className="sp-btn sp-btn--primary" onClick={handleSave}>Enregistrer</button>
                      <button className="sp-btn sp-btn--outline" onClick={handleCancel}>Annuler</button>
                    </div>
                  </div>
                </div>
              </section>
            ) : (
              <section className="sp-section">
                <div className="sp-section__header">
                  <h3 className="sp-section__title">Informations personnelles</h3>
                </div>
                <div className="sp-card">
                  <div className="sp-about">
                    <div className="sp-about__row">
                      <span className="sp-about__label">Nom</span>
                      <span className="sp-about__value">{profile.displayName}</span>
                    </div>
                    <div className="sp-about__row">
                      <span className="sp-about__label">E-mail</span>
                      <span className="sp-about__value">{profile.email}</span>
                    </div>
                    <div className="sp-about__row">
                      <span className="sp-about__label">Téléphone</span>
                      <span className="sp-about__value">{profile.phone}</span>
                    </div>
                    <div className="sp-about__row">
                      <span className="sp-about__label">Localisation</span>
                      <span className="sp-about__value">{profile.location}</span>
                    </div>
                    <div className="sp-about__row">
                      <span className="sp-about__label">Bio</span>
                      <span className="sp-about__value">{profile.bio}</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Badges */}
            <section className="sp-section">
              <div className="sp-section__header">
                <h3 className="sp-section__title">Badges</h3>
                <p className="sp-section__sub">Récompenses obtenues pour votre activité.</p>
              </div>
              <div className="pf-badges">
                {badges.map((b) => (
                  <div key={b.label} className="pf-badge" style={{ "--badge-color": b.color } as React.CSSProperties}>
                    <span className="pf-badge__emoji">{b.emoji}</span>
                    <span className="pf-badge__label">{b.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right column */}
          <div className="pf-col pf-col--right">
            {/* Stats */}
            <section className="sp-section">
              <div className="sp-section__header">
                <h3 className="sp-section__title">Statistiques</h3>
                <p className="sp-section__sub">Votre activité sur Daylence.</p>
              </div>
              <div className="pf-stats">
                {stats.map((s) => (
                  <div key={s.label} className="pf-stat" style={{ "--stat-color": s.color } as React.CSSProperties}>
                    <span className="pf-stat__value">{s.value}</span>
                    <span className="pf-stat__label">{s.label}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent activity */}
            <section className="sp-section">
              <div className="sp-section__header">
                <h3 className="sp-section__title">Activité récente</h3>
              </div>
              <div className="sp-card">
                {recentActivity.map((a, i) => (
                  <div key={i} className="pf-activity">
                    <span className="pf-activity__icon">{a.icon}</span>
                    <div className="pf-activity__text">
                      <span className="pf-activity__label">{a.label}</span>
                      <span className="pf-activity__detail">{a.detail}</span>
                    </div>
                    <span className="pf-activity__date">{a.date}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Danger zone */}
            <section className="sp-section">
              <div className="sp-section__header">
                <h3 className="sp-section__title sp-section__title--danger">Zone dangereuse</h3>
              </div>
              <div className="sp-card sp-card--danger">
                <div className="sp-row">
                  <div className="sp-row__text">
                    <span className="sp-row__label">Supprimer mon compte</span>
                    <span className="sp-row__desc">Cette action est irréversible. Toutes vos données seront supprimées.</span>
                  </div>
                  <button className="sp-btn sp-btn--danger">Supprimer</button>
                </div>
                <div className="sp-row">
                  <div className="sp-row__text">
                    <span className="sp-row__label">Exporter mes données</span>
                    <span className="sp-row__desc">Téléchargez une copie de toutes vos données au format JSON.</span>
                  </div>
                  <button className="sp-btn sp-btn--outline">Exporter</button>
                </div>
              </div>
            </section>
          </div>
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
