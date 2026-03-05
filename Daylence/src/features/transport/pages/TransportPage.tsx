import SelectVehicle from "../components/SelectVehicle";
import "../css/TransportPage.css";

export default function TransportPage() {
  return (
    <div className="transport-page">
      {/* ── Header ── */}
      <header className="transport-header">
        <a href="/" className="transport-header__brand">
          <img
            src="/daylence_logo_without_title.png"
            alt="Daylence"
            className="transport-header__logo"
          />
          <span className="transport-header__title">Daylence</span>
        </a>

        <nav className="transport-header__nav">
          <a href="/" className="transport-header__link">
            Accueil
          </a>
          <a href="/discover" className="transport-header__link">
            Découvrir
          </a>
          <a href="/support" className="transport-header__link">
            Support
          </a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="transport-hero">
        <img
          src="/daylence_transport_logo.png"
          alt="Transport"
          className="transport-hero__icon"
        />
        <h1 className="transport-hero__title">Où allez-vous&nbsp;?</h1>
        <p className="transport-hero__sub">
          Choisissez votre mode de transport pour calculer votre itinéraire.
        </p>
      </section>

      {/* ── Vehicle selection ── */}
      <SelectVehicle />

      {/* ── Footer ── */}
      <footer className="transport-footer">
        <div className="transport-footer__inner">
          <span className="transport-footer__copy">
            &copy; {new Date().getFullYear()} Daylence
          </span>
          <div className="transport-footer__links">
            <a href="/privacy-policy">Confidentialité</a>
            <a href="/support">Aide</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
