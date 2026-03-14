import { Link } from "react-router-dom";
import PageHeader from "../../../components/layout/PageHeader";
import SelectVehicle from "../components/SelectVehicle";
import "../css/TransportPage.css";

export default function TransportPage() {
  return (
    <div className="transport-page">
      {/* ── Header ── */}
      <PageHeader
        right={
          <>
            <Link to="/home" className="ph__nav-link">
              Accueil
            </Link>
            <Link to="/discover" className="ph__nav-link">
              Découvrir
            </Link>
            <Link to="/support" className="ph__nav-link">
              Support
            </Link>
          </>
        }
      />

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
