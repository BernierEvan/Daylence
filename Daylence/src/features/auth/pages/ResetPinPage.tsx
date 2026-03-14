import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  KeyRound,
  Check,
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import "../css/ResetPinPage.css";

const RESET_PIN_WEBHOOK_URL =
  "https://n8n.srv1455737.hstgr.cloud/webhook/reset-pin-confirm";

type ResetStatus = "form" | "loading" | "success" | "error" | "invalid-link";

export default function ResetPinPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [status, setStatus] = useState<ResetStatus>(
    token ? "form" : "invalid-link",
  );
  const [errorMsg, setErrorMsg] = useState("");

  /* If no token in URL → invalid link */
  useEffect(() => {
    if (!token) setStatus("invalid-link");
  }, [token]);

  const pinValid = /^\d{4,6}$/.test(pin);
  const pinsMatch = pin === confirmPin;
  const canSubmit = pinValid && pinsMatch && status === "form";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(RESET_PIN_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPin: pin }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(
          data.reason === "expired"
            ? "Ce lien a expiré. Veuillez refaire une demande."
            : "Lien invalide ou déjà utilisé.",
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg("Erreur de connexion. Réessayez plus tard.");
      setStatus("error");
    }
  };

  return (
    <div className="rp-page">
      {/* Animated background orbs */}
      <div className="rp-bg">
        <div className="rp-orb rp-orb--1" />
        <div className="rp-orb rp-orb--2" />
        <div className="rp-orb rp-orb--3" />
      </div>

      <div className="rp-card">
        <div className="rp-brand">
          <img
            src="/daylence_logo_without_title.png"
            alt="Daylence"
            className="rp-logo"
          />
          <h1 className="rp-title">Réinitialiser le PIN</h1>
        </div>

        {/* ── Invalid link ── */}
        {status === "invalid-link" && (
          <div className="rp-result">
            <div className="rp-result__icon rp-result__icon--error">
              <AlertTriangle size={32} />
            </div>
            <p className="rp-result__heading">Lien invalide</p>
            <p className="rp-result__text">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <div className="rp-result">
            <div className="rp-result__icon rp-result__icon--error">
              <AlertTriangle size={32} />
            </div>
            <p className="rp-result__heading">Échec</p>
            <p className="rp-result__text">{errorMsg}</p>
            <button
              className="rp-btn rp-btn--secondary"
              onClick={() => setStatus("form")}
            >
              <ArrowLeft size={16} /> Réessayer
            </button>
          </div>
        )}

        {/* ── Success ── */}
        {status === "success" && (
          <div className="rp-result">
            <div className="rp-result__icon rp-result__icon--success">
              <Check size={32} />
            </div>
            <p className="rp-result__heading">PIN réinitialisé</p>
            <p className="rp-result__text">
              Votre nouveau code PIN est actif. Vous pouvez fermer cette page et
              retourner sur l'application.
            </p>
          </div>
        )}

        {/* ── Form ── */}
        {(status === "form" || status === "loading") && (
          <>
            <p className="rp-subtitle">
              Choisissez un nouveau code PIN (4 à 6 chiffres).
            </p>

            <form className="rp-form" onSubmit={handleSubmit}>
              <div className="rp-field">
                <KeyRound size={18} className="rp-field__icon" />
                <input
                  className="rp-field__input"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Nouveau PIN"
                  value={pin}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setPin(v);
                  }}
                  autoFocus
                />
              </div>

              <div className="rp-field">
                <KeyRound size={18} className="rp-field__icon" />
                <input
                  className="rp-field__input"
                  type="password"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="Confirmer le PIN"
                  value={confirmPin}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setConfirmPin(v);
                  }}
                />
              </div>

              {pin.length >= 4 && confirmPin.length >= 4 && !pinsMatch && (
                <p className="rp-mismatch">
                  Les codes PIN ne correspondent pas.
                </p>
              )}

              <button
                className="rp-submit"
                type="submit"
                disabled={!canSubmit || status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 size={20} className="rp-spinner" />
                ) : (
                  "Réinitialiser"
                )}
              </button>
            </form>
          </>
        )}

        <p className="rp-footer">&copy; {new Date().getFullYear()} Daylence</p>
      </div>
    </div>
  );
}
