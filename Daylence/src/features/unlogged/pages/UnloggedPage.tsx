import { useEffect, useRef } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../css/UnloggedPageStyle.css";

/* ── Feature section data ── */
const features = [
  {
    id: "recipes",
    image: "/daylence_recipe_logo.png",
    accent: "#f97316",
    bg: "#fff7ed",
    colored: false,
    title: "Recettes & Cuisine",
    headline: "Planifiez vos repas,\ndécouvrez des recettes",
    description:
      "Parcourez une bibliothèque de recettes, planifiez vos repas de la semaine et générez des listes de courses intelligentes — en quelques secondes. Bien manger n'a jamais été aussi simple.",
    bullets: [
      "Recherche de recettes intelligente",
      "Planificateur de repas hebdomadaire",
      "Listes de courses automatiques",
    ],
  },
  {
    id: "sleep",
    image: "/daylence_sleep_logo.png",
    accent: "#818cf8",
    bg: "linear-gradient(135deg, #4338ca, #6366f1)",
    colored: true,
    title: "Suivi du Sommeil",
    headline: "Dormez mieux,\nvivez mieux",
    description:
      "Suivez vos habitudes de sommeil, programmez des rappels de coucher et obtenez des conseils personnalisés pour améliorer votre repos. Réveillez-vous en pleine forme chaque matin.",
    bullets: [
      "Analyses détaillées du sommeil",
      "Rappels de coucher intelligents",
      "Score de qualité du sommeil",
    ],
  },
  {
    id: "transport",
    image: "/daylence_transport_logo.png",
    accent: "#0ea5e9",
    bg: "#f0f9ff",
    colored: false,
    title: "Transports",
    headline: "Ne ratez plus\nvotre bus",
    description:
      "Horaires en temps réel, planification d'itinéraires et alertes de départ pour bus, trains et plus encore. Déplacez-vous sereinement.",
    bullets: [
      "Horaires en temps réel",
      "Planification multi-modale",
      "Alertes retards & perturbations",
    ],
  },
  {
    id: "budget",
    image: "/daylence_budget_logo.png",
    accent: "#34d399",
    bg: "linear-gradient(135deg, #059669, #10b981)",
    colored: true,
    title: "Gestion du Budget",
    headline: "Maîtrisez vos\nfinances",
    description:
      "Définissez des budgets, suivez vos dépenses et visualisez vos habitudes grâce à des graphiques clairs. Prenez le contrôle de votre argent sans prise de tête.",
    bullets: [
      "Catégorisation des dépenses",
      "Objectifs budgétaires mensuels",
      "Visualisation des dépenses",
    ],
  },
  {
    id: "work",
    image: "/daylence_work_logo.png",
    accent: "#a78bfa",
    bg: "#faf5ff",
    colored: false,
    title: "Travail & Tâches",
    headline: "Organisez votre travail,\natteignez vos objectifs",
    description:
      "Un gestionnaire de tâches puissant avec tableaux Kanban, priorités et échéances. Des petites courses aux grands projets — gardez tout sous contrôle.",
    bullets: [
      "Vues Kanban & listes",
      "Niveaux de priorité & tags",
      "Suivi des échéances & rappels",
    ],
  },
  {
    id: "blocker",
    image: "/daylence_core_logo.png",
    accent: "#fb7185",
    bg: "linear-gradient(135deg, #e11d48, #f43f5e)",
    colored: true,
    title: "Bloqueur d'Apps",
    headline: "Restez concentré,\nbloquez les distractions",
    description:
      "Programmez des sessions de blocage pour retrouver votre concentration. Définissez des règles personnalisées et regardez votre temps d'écran diminuer.",
    bullets: [
      "Sessions de blocage programmées",
      "Règles personnalisées par app",
      "Statistiques de concentration",
    ],
  },
];

export default function UnloggedPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.2 },
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="unlogged-page">
      <Header />

      <div className="unlogged-snap-container">
        {/* ── Hero ── */}
        <section className="snap-section unlogged-hero">
          <div className="unlogged-hero__inner">
            <div className="unlogged-hero__image-wrap">
              <img
                src="/3d_daylence_logo.png"
                alt="Logo Daylence"
                className="unlogged-hero__image logo-float"
              />
            </div>

            <div className="unlogged-hero__text">
              <h1 className="unlogged-hero__headline">
                Prenez le contrôle de votre journée avec <span>Daylence</span>
              </h1>
              <p className="unlogged-hero__sub">
                Organisez vos tâches, programmez des rappels et suivez votre
                progression &mdash; tout au même endroit. Dites adieu aux
                échéances manquées et bonjour à une vie plus efficace et
                équilibrée.
              </p>
              <div className="unlogged-hero__actions">
                <a href="/login" className="unlogged-hero__btn-primary">
                  Commencer &mdash; C'est Gratuit
                </a>
                <a href="/discover" className="unlogged-hero__btn-secondary">
                  En savoir plus
                </a>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator">
            <span className="scroll-indicator__text">Défiler</span>
            <div className="scroll-indicator__arrow" />
          </div>
        </section>

        {/* ── Feature sections ── */}
        {features.map((feat, i) => {
          const isReversed = i % 2 !== 0;
          const bgStyle = feat.bg.startsWith("linear")
            ? { background: feat.bg }
            : { backgroundColor: feat.bg };

          return (
            <section
              key={feat.id}
              ref={(el) => {
                sectionRefs.current[i] = el;
              }}
              className={`snap-section feat-section reveal-on-scroll ${isReversed ? "feat-section--reversed" : ""} ${feat.colored ? "feat-section--colored" : "feat-section--light"}`}
              style={bgStyle}
            >
              {/* Decorative blob */}
              <div
                className="feat-section__blob"
                style={{ background: feat.accent }}
              />

              <div className="feat-section__inner">
                {/* Image side */}
                <div className="feat-section__visual">
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="feat-section__logo-img logo-float"
                    style={{ animationDelay: `${i * 0.4}s` }}
                  />
                </div>

                {/* Text side */}
                <div className="feat-section__text">
                  <span
                    className="feat-section__label"
                    style={{
                      color: feat.colored
                        ? "rgba(255,255,255,0.8)"
                        : feat.accent,
                    }}
                  >
                    {feat.title}
                  </span>
                  <h2 className="feat-section__headline">
                    {feat.headline.split("\n").map((line, j) => (
                      <span key={j}>
                        {line}
                        {j === 0 && <br />}
                      </span>
                    ))}
                  </h2>
                  <p className="feat-section__desc">{feat.description}</p>
                  <ul className="feat-section__bullets">
                    {feat.bullets.map((b) => (
                      <li key={b}>
                        <span
                          className="feat-section__bullet-dot"
                          style={{
                            background: feat.colored
                              ? "rgba(255,255,255,0.9)"
                              : feat.accent,
                          }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          );
        })}

        {/* ── CTA Banner ── */}
        <section
          ref={(el) => {
            sectionRefs.current[features.length] = el;
          }}
          className="snap-section unlogged-cta reveal-on-scroll"
        >
          <h2 className="unlogged-cta__headline">
            Prêt à transformer votre quotidien ?
          </h2>
          <p className="unlogged-cta__sub">
            Rejoignez des milliers d'utilisateurs qui gèrent déjà toute leur
            journée avec Daylence.
          </p>
          <a href="/login" className="unlogged-cta__btn">
            Commencer gratuitement
          </a>
        </section>

        {/* ── Footer ── */}
        <div className="snap-section snap-section--footer">
          <Footer />
        </div>
      </div>
    </div>
  );
}
