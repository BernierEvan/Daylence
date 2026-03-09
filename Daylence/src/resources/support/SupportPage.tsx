import React, { useState } from "react";
import Header from "../../features/unlogged/components/header";
import Footer from "../../features/unlogged/components/footer";
import "../../features/unlogged/css/UnloggedPageStyle.css";
import "../../styles/InnerPages.css";

const faqs = [
  {
    q: "Comment créer un compte Daylence ?",
    a: "Cliquez sur « Commencer » en haut de la page, puis renseignez votre adresse e-mail et un mot de passe. C'est gratuit et ne prend que 30 secondes.",
  },
  {
    q: "Daylence est-il vraiment gratuit ?",
    a: "Oui ! Daylence propose un plan gratuit. Des options premium sont disponibles pour les utilisateurs souhaitant des fonctionnalités avancées.",
  },
  {
    q: "Sur quelles plateformes Daylence est-il disponible ?",
    a: "Daylence est disponible sur le web (tous navigateurs modernes), ainsi que sur Android.",
  },
  {
    q: "Comment fonctionne le bloqueur d'applications ?",
    a: "Le bloqueur vous permet de définir des plages horaires pendant lesquelles certaines applications seront inaccessibles. Vous pouvez personnaliser les règles par application et par jour de la semaine.",
  },
  {
    q: "Mes données sont-elles sécurisées ?",
    a: "Absolument. Vos données sont chiffrées en transit et au repos. Consultez notre politique de confidentialité pour plus de détails.",
  },
  {
    q: "Comment supprimer mon compte ?",
    a: "Rendez-vous dans Paramètres > Mon compte > Supprimer le compte. Toutes vos données seront définitivement effacées dans un délai de 30 jours.",
  },
];

export default function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="inner-page">
      <Header />

      {/* Hero */}
      <section className="inner-hero inner-hero--teal">
        <span className="inner-hero__label">Centre d'aide</span>
        <h1 className="inner-hero__title">
          Comment pouvons-nous
          <br />
          vous aider ?
        </h1>
        <p className="inner-hero__sub">
          Trouvez des réponses à vos questions, consultez nos guides ou
          contactez notre équipe de support.
        </p>
      </section>

      <div className="inner-content">
        {/* FAQ */}
        <div className="inner-section">
          <h2 className="inner-section__title">Questions fréquentes</h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item ${openIndex === i ? "faq-item--open" : ""}`}
              >
                <button
                  className="faq-item__question"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  {faq.q}
                  <svg
                    className="faq-item__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="faq-item__answer">{faq.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact cards */}
        <div className="inner-section">
          <h2 className="inner-section__title">Nous contacter</h2>
          <p className="inner-section__text">
            Vous n'avez pas trouvé votre réponse ? Notre équipe est là pour
            vous.
          </p>
          <div className="contact-cards">
            <div className="contact-card">
              <div
                className="contact-card__icon"
                style={{
                  background:
                    "linear-gradient(135deg, var(--d-accent-dark), var(--d-accent))",
                }}
              >
                ✉️
              </div>
              <h3 className="contact-card__title">E-mail</h3>
              <p className="contact-card__text">
                Envoyez-nous un message et nous vous répondrons sous 24 heures.
              </p>
              <a
                href="mailto:support@daylence.com"
                className="contact-card__link"
              >
                support@daylence.com →
              </a>
            </div>

            <div className="contact-card">
              <div
                className="contact-card__icon"
                style={{
                  background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                }}
              >
                💬
              </div>
              <h3 className="contact-card__title">Chat en direct</h3>
              <p className="contact-card__text">
                Discutez avec IA en temps réel.
              </p>
              <span className="contact-card__link">Bientôt disponible</span>
            </div>

            <div className="contact-card">
              <div
                className="contact-card__icon"
                style={{
                  background: "linear-gradient(135deg, #f43f5e, #fb7185)",
                }}
              >
                📖
              </div>
              <h3 className="contact-card__title">Documentation</h3>
              <p className="contact-card__text">
                Consultez nos guides détaillés pour tirer le meilleur de
                Daylence.
              </p>
              <a href="/discover" className="contact-card__link">
                Voir les guides →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="inner-cta">
        <h2 className="inner-cta__title">Toujours besoin d'aide ?</h2>
        <p className="inner-cta__sub">
          Notre équipe est disponible pour répondre à toutes vos questions.
        </p>
        <a href="mailto:support@daylence.com" className="inner-cta__btn">
          Contacter le support
        </a>
      </section>

      <Footer />
    </div>
  );
}
