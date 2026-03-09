import Header from "../../../features/unlogged/components/header";
import Footer from "../../../features/unlogged/components/footer";
import "../../../features/unlogged/css/UnloggedPageStyle.css";
import "../../../styles/InnerPages.css";

const features = [
  {
    image: "/daylence_recipe_logo.png",
    accent: "#f97316",
    title: "Recettes & Cuisine",
    desc: "Parcourez des centaines de recettes, planifiez vos repas de la semaine et générez des listes de courses automatiques. Cuisiner n'a jamais été aussi simple.",
    badge: "Populaire",
  },
  {
    image: "/daylence_sleep_logo.png",
    accent: "#6366f1",
    title: "Suivi du Sommeil",
    desc: "Analysez vos cycles de sommeil, recevez des recommandations personnalisées et améliorez votre repos nuit après nuit.",
    badge: "Nouveau",
  },
  {
    image: "/daylence_transport_logo.png",
    accent: "#0ea5e9",
    title: "Transports",
    desc: "Horaires en temps réel, itinéraires optimisés et alertes de retard pour bus, trains et métros. Ne ratez plus jamais votre correspondance.",
    badge: "Temps réel",
  },
  {
    image: "/daylence_budget_logo.png",
    accent: "#10b981",
    title: "Gestion du Budget",
    desc: "Suivez vos dépenses, définissez des objectifs budgétaires et visualisez vos habitudes financières en un coup d'œil.",
    badge: "Essentiel",
  },
  {
    image: "/daylence_work_logo.png",
    accent: "#8b5cf6",
    title: "Travail & Tâches",
    desc: "Tableaux Kanban, listes de tâches, priorités et échéances. Gérez vos projets professionnels et personnels au même endroit.",
    badge: "Productivité",
  },
  {
    image: "/daylence_core_logo.png",
    accent: "#ef4444",
    title: "Bloqueur d'Apps",
    desc: "Bloquez les applications distrayantes pendant vos sessions de travail. Reprenez le contrôle de votre temps d'écran.",
    badge: "Focus",
  },
];

export default function DiscoverPage() {
  return (
    <div className="inner-page">
      <Header />

      {/* Hero */}
      <section className="inner-hero inner-hero--purple">
        <span className="inner-hero__label">Découvrir Daylence</span>
        <h1 className="inner-hero__title">
          Tout ce dont vous avez besoin,
          <br />
          au même endroit
        </h1>
        <p className="inner-hero__sub">
          Daylence regroupe 6 outils essentiels pour organiser chaque aspect de
          votre quotidien. Découvrez comment chaque fonctionnalité peut
          transformer votre journée.
        </p>
      </section>

      {/* Feature cards */}
      <div className="inner-content">
        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div
                className="feature-card__blob"
                style={{ background: f.accent }}
              />
              <img src={f.image} alt={f.title} className="feature-card__img" />
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
              <span
                className="feature-card__badge"
                style={{ background: f.accent }}
              >
                {f.badge}
              </span>
            </div>
          ))}
        </div>

        {/* Why Daylence */}
        <div className="inner-section" style={{ marginTop: 64 }}>
          <h2 className="inner-section__title">Pourquoi choisir Daylence ?</h2>
          <p className="inner-section__text">
            Contrairement aux applications qui ne gèrent qu'un seul aspect de
            votre vie, Daylence rassemble tout dans un écosystème cohérent.
            Moins d'apps ouvertes, plus de productivité.
          </p>
          <ul className="inner-section__list">
            <li>
              <strong>Tout-en-un</strong> — 6 outils intégrés qui communiquent
              entre eux
            </li>
            <li>
              <strong>Design intuitif</strong> — Interface épurée, prise en main
              immédiate
            </li>
            <li>
              <strong>Gratuit pour commencer</strong> — Aucune carte de crédit
              requise
            </li>
            <li>
              <strong>Multi-plateforme</strong> — Web, iOS et Android
            </li>
            <li>
              <strong>Données sécurisées</strong> — Chiffrement de bout en bout
            </li>
          </ul>
        </div>
      </div>

      {/* CTA */}
      <section className="inner-cta">
        <h2 className="inner-cta__title">
          Prêt à simplifier votre quotidien ?
        </h2>
        <p className="inner-cta__sub">
          Rejoignez des milliers d'utilisateurs qui gèrent déjà leur journée
          avec Daylence.
        </p>
        <a href="/login" className="inner-cta__btn">
          Commencer gratuitement
        </a>
      </section>

      <Footer />
    </div>
  );
}
