import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TransportPage.css";

interface TransportMode {
  id: string;
  label: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  image: string;
  gradient: string;
  accent: string;
  badge: string;
  badgeIcon: string;
  type: "map" | "sncf";
}

const CAR_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 17h14M5 17a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1l2-3h8l2 3h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M5 17a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Zm14 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
  </svg>
);

const TRAIN_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="3" width="16" height="16" rx="3" />
    <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M8 15h.01M16 15h.01" />
  </svg>
);

const WALK_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="4" r="2" />
    <path d="m14 7-1.5 7.5M9 20l1.5-5.5M14 7l3 3M14 7H9l-3 7M10.5 14.5 8 20M14.5 14.5 17 20" />
  </svg>
);

const BIKE_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5.5" cy="17.5" r="3.5" />
    <circle cx="18.5" cy="17.5" r="3.5" />
    <path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM12 17.5 8.5 10H15l3.5 7.5" />
    <path d="M8.5 10 5.5 17.5" />
    <path d="m15 10-2.5-2H10" />
  </svg>
);

const modes: TransportMode[] = [
  {
    id: "car",
    label: "Voiture",
    description: "Itinéraire routier optimisé",
    details: ["Trafic en temps réel", "Carte interactive", "Temps estimé"],
    icon: CAR_ICON,
    image:
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
    gradient: "linear-gradient(135deg, #1e3a5f 0%, #3b82f6 50%, #60a5fa 100%)",
    accent: "#3b82f6",
    badge: "Carte",
    badgeIcon: "🗺️",
    type: "map",
  },
  {
    id: "transit",
    label: "Transport en commun",
    description: "SNCF, TER, métro & bus",
    details: ["Horaires en direct", "Correspondances", "Alertes retard"],
    icon: TRAIN_ICON,
    image:
      "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=600&q=80",
    gradient: "linear-gradient(135deg, #7f1d1d 0%, #ef4444 50%, #f87171 100%)",
    accent: "#ef4444",
    badge: "Horaires",
    badgeIcon: "🕐",
    type: "sncf",
  },
  {
    id: "walk",
    label: "Marche à pied",
    description: "Sentiers & chemins piétons",
    details: ["Itinéraires piétons", "Distance & calories", "Points d'intérêt"],
    icon: WALK_ICON,
    image:
      "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80",
    gradient: "linear-gradient(135deg, #14532d 0%, #22c55e 50%, #4ade80 100%)",
    accent: "#22c55e",
    badge: "Carte",
    badgeIcon: "🗺️",
    type: "map",
  },
  {
    id: "bike",
    label: "Vélo",
    description: "Pistes cyclables & voies vertes",
    details: ["Pistes sécurisées", "Dénivelé affiché", "Bornes vélib'"],
    icon: BIKE_ICON,
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&q=80",
    gradient: "linear-gradient(135deg, #78350f 0%, #f59e0b 50%, #fbbf24 100%)",
    accent: "#f59e0b",
    badge: "Carte",
    badgeIcon: "🗺️",
    type: "map",
  },
];

export default function SelectVehicle() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSelect = (mode: TransportMode) => {
    if (mode.type === "sncf") {
      navigate("/transport/public");
    } else {
      console.log(`Selected: ${mode.id} (${mode.type})`);
    }
  };

  return (
    <section className="sv-section">
      <div className="sv-grid">
        {modes.map((mode, index) => (
          <button
            key={mode.id}
            className={`sv-card ${hoveredId === mode.id ? "sv-card--active" : ""}`}
            style={
              {
                "--card-gradient": mode.gradient,
                "--card-accent": mode.accent,
                animationDelay: `${index * 0.12}s`,
              } as React.CSSProperties
            }
            onMouseEnter={() => setHoveredId(mode.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleSelect(mode)}
          >
            {/* Background image */}
            <div className="sv-card__img-wrap">
              <img
                src={mode.image}
                alt={mode.label}
                className="sv-card__img"
                loading="lazy"
              />
              <div className="sv-card__img-overlay" />
            </div>

            {/* Content */}
            <div className="sv-card__content">
              {/* Icon circle */}
              <div className="sv-card__icon-circle">{mode.icon}</div>

              {/* Label & description */}
              <h3 className="sv-card__label">{mode.label}</h3>
              <p className="sv-card__desc">{mode.description}</p>

              {/* Detail bullets */}
              <ul className="sv-card__details">
                {mode.details.map((d) => (
                  <li key={d}>
                    <span className="sv-card__dot" />
                    {d}
                  </li>
                ))}
              </ul>

              {/* Badge + Arrow row */}
              <div className="sv-card__footer">
                <span className="sv-card__badge">
                  {mode.badgeIcon} {mode.badge}
                </span>
                <span className="sv-card__arrow">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
