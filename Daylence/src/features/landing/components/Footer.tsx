import React from "react";

export default function Footer() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer__inner">
        {/* Brand column */}
        <div className="landing-footer__brand">
          <div className="landing-footer__brand-row">
            <img
              src="/daylence_logo_without_title.png"
              alt="Daylence"
              className="landing-footer__brand-logo"
            />
            <span className="landing-footer__brand-name">Daylence</span>
          </div>
          <p className="landing-footer__brand-desc">
            Votre compagnon ultime de gestion du temps. Organisez vos tâches,
            suivez vos habitudes et prenez le contrôle de votre journée.
          </p>
        </div>

        {/* Product column */}
        <div className="landing-footer__col">
          <h4 className="landing-footer__col-title">Produit</h4>
          <a href="/discover" className="landing-footer__link">
            Découvrir
          </a>
          <a href="/pricing" className="landing-footer__link">
            Tarifs
          </a>
          <a href="/download" className="landing-footer__link">
            Télécharger
          </a>
        </div>

        {/* Resources column */}
        <div className="landing-footer__col">
          <h4 className="landing-footer__col-title">Ressources</h4>
          <a href="/support" className="landing-footer__link">
            Support
          </a>
          <a href="/login" className="landing-footer__link">
            Se connecter
          </a>
        </div>

        {/* Legal column */}
        <div className="landing-footer__col">
          <h4 className="landing-footer__col-title">Légal</h4>
          <a href="/privacy-policy" className="landing-footer__link">
            Politique de confidentialité
          </a>
          <a href="/confidentiality" className="landing-footer__link">
            Conditions d'utilisation
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="landing-footer__bottom">
        <p className="landing-footer__copy">
          &copy; {new Date().getFullYear()} Daylence. Tous droits réservés.
        </p>
        <div className="landing-footer__socials">
          {/* Twitter / X */}
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-footer__social-link"
            aria-label="Twitter"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="landing-footer__social-link"
            aria-label="GitHub"
          >
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1 .006 .999 .999 .999 .999 .9 .9 .9 .9 .9 .9 .9 .9 .9 .9 .9 .9 .9 .9 .f" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
