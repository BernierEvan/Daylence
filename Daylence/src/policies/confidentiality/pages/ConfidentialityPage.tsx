import React from "react";
import Header from "../../../features/unlogged/components/header";
import Footer from "../../../features/unlogged/components/footer";
import "../../../features/unlogged/css/UnloggedPageStyle.css";
import "../../../styles/InnerPages.css";

export default function ConfidentialityPage() {
  return (
    <div className="inner-page">
      <Header />

      {/* Hero */}
      <section className="inner-hero inner-hero--rose">
        <span className="inner-hero__label">Légal</span>
        <h1 className="inner-hero__title">
          Politique de
          <br />
          Confidentialité
        </h1>
        <p className="inner-hero__sub">
          Nous prenons la protection de vos données personnelles très au
          sérieux. Découvrez comment nous les collectons, utilisons et
          protégeons.
        </p>
      </section>

      <div className="inner-content">
        <span className="legal-updated">
          📅 Dernière mise à jour : 1er mars 2026
        </span>

        <div className="inner-section">
          <h2 className="inner-section__title">1. Données collectées</h2>
          <p className="inner-section__text">
            Lors de votre utilisation de Daylence, nous pouvons collecter les
            données suivantes :
          </p>
          <ul className="inner-section__list">
            <li>
              <strong>Données d'identification</strong> : adresse e-mail, nom
              d'utilisateur, photo de profil
            </li>
            <li>
              <strong>Données d'usage</strong> : fonctionnalités utilisées,
              fréquence de connexion, préférences
            </li>
            <li>
              <strong>Données techniques</strong> : type d'appareil, système
              d'exploitation, adresse IP, navigateur
            </li>
            <li>
              <strong>Données de contenu</strong> : tâches, recettes
              enregistrées, budgets, habitudes de sommeil
            </li>
          </ul>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">2. Finalités du traitement</h2>
          <p className="inner-section__text">
            Vos données sont collectées et traitées pour les finalités suivantes
            :
          </p>
          <ul className="inner-section__list">
            <li>Fournir et améliorer les fonctionnalités du Service</li>
            <li>Personnaliser votre expérience (recommandations, rappels)</li>
            <li>Assurer la sécurité du Service et prévenir les abus</li>
            <li>
              Communiquer avec vous (notifications, mises à jour, support)
            </li>
            <li>Réaliser des statistiques anonymes d'utilisation</li>
          </ul>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">3. Stockage et sécurité</h2>
          <p className="inner-section__text">
            Vos données sont hébergées sur des serveurs sécurisés via Supabase
            (infrastructure AWS). Elles sont chiffrées en transit (TLS 1.3) et
            au repos (AES-256). Nous appliquons les meilleures pratiques de
            sécurité, incluant :
          </p>
          <ul className="inner-section__list">
            <li>Authentification sécurisée avec hachage des mots de passe</li>
            <li>
              Accès aux données restreint par des politiques RLS (Row Level
              Security)
            </li>
            <li>Sauvegardes régulières et plan de reprise d'activité</li>
            <li>Audits de sécurité périodiques</li>
          </ul>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">4. Partage des données</h2>
          <p className="inner-section__text">
            Nous ne vendons jamais vos données personnelles. Elles ne sont
            partagées qu'avec les prestataires techniques nécessaires au
            fonctionnement du Service (hébergement, authentification). Tout
            prestataire est soumis à des obligations de confidentialité
            strictes.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">5. Vos droits</h2>
          <p className="inner-section__text">
            Conformément au Règlement Général sur la Protection des Données
            (RGPD), vous disposez des droits suivants :
          </p>
          <ul className="inner-section__list">
            <li>
              <strong>Droit d'accès</strong> — Obtenir une copie de vos données
              personnelles
            </li>
            <li>
              <strong>Droit de rectification</strong> — Corriger des données
              inexactes ou incomplètes
            </li>
            <li>
              <strong>Droit à l'effacement</strong> — Demander la suppression de
              vos données
            </li>
            <li>
              <strong>Droit à la portabilité</strong> — Recevoir vos données
              dans un format structuré
            </li>
            <li>
              <strong>Droit d'opposition</strong> — Vous opposer au traitement
              de vos données
            </li>
          </ul>
          <p className="inner-section__text">
            Pour exercer l'un de ces droits, contactez-nous à :{" "}
            <a href="mailto:privacy@daylence.com">privacy@daylence.com</a>
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">6. Cookies</h2>
          <p className="inner-section__text">
            Daylence utilise des cookies strictement nécessaires au
            fonctionnement du Service (authentification, préférences). Aucun
            cookie publicitaire ou de traçage tiers n'est utilisé.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">7. Durée de conservation</h2>
          <p className="inner-section__text">
            Vos données personnelles sont conservées tant que votre compte est
            actif. En cas de suppression de compte, vos données sont
            définitivement effacées dans un délai de 30 jours. Les données
            anonymisées à des fins statistiques peuvent être conservées sans
            limitation de durée.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="inner-section">
          <h2 className="inner-section__title">8. Contact</h2>
          <p className="inner-section__text">
            Pour toute question relative à cette politique de confidentialité,
            vous pouvez nous écrire à :{" "}
            <a href="mailto:privacy@daylence.com">privacy@daylence.com</a>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
