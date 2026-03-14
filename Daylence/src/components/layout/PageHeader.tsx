import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Settings, User } from "lucide-react";
import "./PageHeader.css";

interface PageHeaderProps {
  /** Navigation items rendered on the right side */
  right?: ReactNode;
}

export default function PageHeader({ right }: PageHeaderProps) {
  return (
    <header className="ph">
      {/* Left — settings + profile */}
      <div className="ph__left">
        <Link to="/settings" className="ph__icon" aria-label="Paramètres">
          <Settings size={18} />
        </Link>
        <Link to="/profile" className="ph__icon" aria-label="Profil">
          <User size={18} />
        </Link>
      </div>

      {/* Center — logo + title */}
      <Link to="/home" className="ph__center">
        <img src="/3d_daylence_logo.png" alt="Daylence" className="ph__logo" />
        <span className="ph__title">Daylence</span>
      </Link>

      {/* Right — page-specific nav */}
      <div className="ph__right">{right}</div>
    </header>
  );
}
