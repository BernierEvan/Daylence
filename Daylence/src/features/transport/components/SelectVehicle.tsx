import { Car, TrainFront, Footprints, Bike, ArrowRight } from "lucide-react";

const modes = [
  {
    key: "car",
    label: "Voiture",
    icon: <Car size={28} />,
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
    color: "#3b82f6",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
    desc: "Itinéraire routier optimisé",
    details: ["Trafic en temps réel", "Péages & carburant", "Temps estimé"],
    badge: "Populaire",
    type: "map" as const,
  },
  {
    key: "transit",
    label: "Transport en commun",
    icon: <TrainFront size={28} />,
    img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80",
    color: "#ef4444",
    gradient: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
    desc: "Métro, bus, RER, TGV",
    details: ["Horaires en direct", "Correspondances", "Tarifs SNCF / RATP"],
    badge: "Éco‑friendly",
    type: "sncf" as const,
  },
  {
    key: "walk",
    label: "À pied",
    icon: <Footprints size={28} />,
    img: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80",
    color: "#22c55e",
    gradient: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
    desc: "Parcours piéton détaillé",
    details: ["Calories brûlées", "Dénivelé", "Chemin le plus court"],
    badge: "Santé",
    type: "map" as const,
  },
  {
    key: "bike",
    label: "Vélo",
    icon: <Bike size={28} />,
    img: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
    desc: "Pistes cyclables & Vélib'",
    details: ["Pistes sécurisées", "Stations Vélib'", "Dénivelé"],
    badge: "Rapide",
    type: "map" as const,
  },
];

export default function SelectVehicle() {
  return (
    <section className="sv-section">
      <div className="sv-grid">
        {modes.map((m) => (
          <button
            key={m.key}
            className="sv-card"
            style={{ "--card-color": m.color } as React.CSSProperties}
          >
            {/* Background image */}
            <div
              className="sv-card__img"
              style={{ backgroundImage: `url(${m.img})` }}
            />

            {/* Gradient overlay */}
            <div
              className="sv-card__overlay"
              style={{ background: m.gradient }}
            />

            {/* Content */}
            <div className="sv-card__body">
              <span className="sv-card__badge">{m.badge}</span>
              <div className="sv-card__icon">{m.icon}</div>
              <h3 className="sv-card__title">{m.label}</h3>
              <p className="sv-card__desc">{m.desc}</p>
              <ul className="sv-card__details">
                {m.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <span className="sv-card__cta">
                Explorer <ArrowRight size={16} className="sv-card__arrow" />
              </span>
            </div>

            {/* Shimmer */}
            <div className="sv-card__shimmer" />
          </button>
        ))}
      </div>
    </section>
  );
}
