import React from "react";
import Header from "../../../features/unlogged/components/header";
import Footer from "../../../features/unlogged/components/footer";
import "../../../features/unlogged/css/UnloggedPageStyle.css";
import "../../../styles/InnerPages.css";

export default function CguPage() {
  return (
    <div className="inner-page">
      <Header />

      {/* Hero */}
      <section className="inner-hero inner-hero--indigo">
        <span className="inner-hero__label">Légal</span>
        <h1 className="inner-hero__title">
          Conditions Générales
          <br />
          d'Utilisation
        </h1>
        <p className="inner-hero__sub">
          Veuillez lire attentivement les conditions suivantes avant d'utiliser
          les services Daylence.
        </p>
      </section>

      <div className="inner-content">
        <span className="legal-updated">
          📅 Dernière mise à jour : 1er mars 2026
        </span>

        <div className="inner-section">
          <h2 className="inner-section__title">1. Objet</h2>
          <p className="inner-section__text">
            Les présentes Conditions Générales d'Utilisation (ci-après « CGU »)
            ont pour objet de définir les modalités et conditions d'utilisation
            des services proposés par Daylence (ci-après « le Service »), ainsi
            que de définir les droits et obligations des parties dans ce cadre.
          </p>
          <p className="inner-section__text">
            En accédant au Service, l'utilisateur accepte sans réserve
            l'intégralité des présentes CGU.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">2. Inscription et compte</h2>
          <p className="inner-section__text">
            L'utilisation du Service nécessite la création d'un compte
            personnel. L'utilisateur s'engage à fournir des informations exactes
            et à jour lors de son inscription. Il est responsable de la
            confidentialité de ses identifiants de connexion.
          </p>
          <ul className="inner-section__list">
            <li>L'utilisateur doit être âgé d'au moins 13 ans</li>
            <li>Chaque personne ne peut détenir qu'un seul compte</li>
            <li>
              Le compte est strictement personnel et ne peut être cédé à un
              tiers
            </li>
          </ul>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">3. Utilisation du Service</h2>
          <p className="inner-section__text">
            Le Service est fourni « en l'état ». L'utilisateur s'engage à
            utiliser le Service conformément à sa destination et aux lois en
            vigueur. Toute utilisation abusive, frauduleuse ou contraire aux
            présentes CGU pourra entraîner la suspension ou la suppression du
            compte.
          </p>
          <p className="inner-section__text">Il est interdit de :</p>
          <ul className="inner-section__list">
            <li>
              Tenter de compromettre la sécurité ou l'intégrité du Service
            </li>
            <li>
              Utiliser le Service à des fins commerciales sans autorisation
              préalable
            </li>
            <li>
              Reproduire, copier ou distribuer tout contenu du Service sans
              autorisation
            </li>
            <li>Collecter des données personnelles d'autres utilisateurs</li>
          </ul>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">4. Propriété intellectuelle</h2>
          <p className="inner-section__text">
            L'ensemble des éléments constituant le Service (textes, images,
            logos, logiciels, bases de données, etc.) est protégé par les lois
            relatives à la propriété intellectuelle. Toute reproduction ou
            utilisation non autorisée est strictement interdite.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">5. Responsabilité</h2>
          <p className="inner-section__text">
            Daylence s'efforce d'assurer la disponibilité et le bon
            fonctionnement du Service, mais ne saurait être tenu responsable des
            interruptions, erreurs ou pertes de données. L'utilisateur utilise
            le Service sous sa propre responsabilité.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">6. Modification des CGU</h2>
          <p className="inner-section__text">
            Daylence se réserve le droit de modifier les présentes CGU à tout
            moment. Les utilisateurs seront informés de toute modification
            substantielle par notification au sein du Service. La poursuite de
            l'utilisation du Service après modification vaut acceptation des
            nouvelles CGU.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">7. Contact</h2>
          <p className="inner-section__text">
            Pour toute question relative aux présentes CGU, vous pouvez nous
            contacter à l'adresse :{" "}
            <a href="mailto:legal@daylence.com">legal@daylence.com</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
