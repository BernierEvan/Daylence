import { Settings, User, Sparkles } from "lucide-react";
import { fmtDateLong } from "../../../lib/utils";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Bonne nuit 🌙";
  if (h < 12) return "Bonjour 🌤️";
  if (h < 18) return "Bon après-midi ☀️";
  return "Bonsoir 🌅";
}

export default function Header() {
  const today = fmtDateLong(new Date());

  return (
    <header className="lp-top">
      {/* Left — actions */}
      <div className="lp-top__left">
        <a href="/settings" className="lp-top__icon" aria-label="Paramètres">
          <Settings size={18} />
        </a>
        <a href="/profile" className="lp-top__icon" aria-label="Profil">
          <User size={18} />
        </a>
      </div>

      {/* Center — brand */}
      <div className="lp-top__center">
        <img
          src="/3d_daylence_logo.png"
          alt="Daylence"
          className="lp-top__logo"
        />
        <div className="lp-top__text">
          <div className="lp-top__title-row">
            <h1 className="lp-top__title">Daylence</h1>
          </div>
          <p className="lp-top__greeting">
            {getGreeting()} — <span className="lp-top__date">{today}</span>
          </p>
        </div>
      </div>

      {/* Right — spacer for centering */}
      <div className="lp-top__right" />
    </header>
  );
}
