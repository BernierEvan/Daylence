import { Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { fmtDateLong } from "../../../lib/utils";
import WeatherWidget from "../../weather/components/WeatherWidget";

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
        <Link to="/settings" className="lp-top__icon" aria-label="Paramètres">
          <Settings size={18} />
        </Link>
        <Link to="/profile" className="lp-top__icon" aria-label="Profil">
          <User size={18} />
        </Link>
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

      {/* Right — weather widget */}
      <div className="lp-top__right">
        <WeatherWidget />
      </div>
    </header>
  );
}
