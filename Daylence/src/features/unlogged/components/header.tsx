import React from "react";

export default function Header() {
  return (
    <header className="unlogged-header">
      <div className="unlogged-header__brand">
        <img
          src="/daylence_logo_without_title.png"
          alt="Daylence"
          className="unlogged-header__logo"
        />
        <span className="unlogged-header__title">Daylence</span>
      </div>

      <nav className="unlogged-header__nav">
        <a href="/discover" className="unlogged-header__link">
          Découvrir
        </a>
        <a href="/pricing" className="unlogged-header__link">
          Tarifs
        </a>
        <a href="/support" className="unlogged-header__link">
          Support
        </a>
        <a href="/login" className="unlogged-header__cta">
          Commencer
        </a>
      </nav>
    </header>
  );
}
