import React from "react";
import "../css/LandingPage.css";

export default function Header() {
  return (
    <>
    <header className="landing-header">
        <div>
            <a href="/parameters" className="landing-header__link">
                Paramètres
            </a>
            <br></br>
            <a href="/profile" className="landing-header__link">
                Mon Profil
            </a>
        </div>
      <div className="landing-header__brand">
        <img
          src="/daylence_logo_without_title.png"
          alt="Daylence"
          className="landing-header__logo"
        />
        <span className="landing-header__title">Daylence</span>
      </div>
      <div>
        <button className="setting-btn">
        <span className="setting-bar setting-bar1"></span>
        <span className="setting-bar setting-bar2"></span>
        <span className="setting-bar setting-bar3"></span>
        </button>

        <a href="fonctionnalities" className="landing-header__link">
          Préférences
        </a>
        <br></br>
        <a href="/pricing" className="landing-header__link">
          Tarifs
        </a>
      </div>

    </header>
    </>
  );
}