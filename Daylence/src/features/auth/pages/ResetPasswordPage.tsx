import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import "../css/ResetPasswordPage.css";

const RESET_PASSWORD_WEBHOOK_URL =
  "https://n8n.srv1455737.hstgr.cloud/webhook/reset-password-confirm";

type ResetStatus = "form" | "loading" | "success" | "error" | "invalid-link";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [status, setStatus] = useState<ResetStatus>(
    token ? "form" : "invalid-link",
  );
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) setStatus("invalid-link");
  }, [token]);

  const passwordValid = password.length >= 6;
  const passwordsMatch = password === confirmPassword;
  const canSubmit = passwordValid && passwordsMatch && status === "form";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch(RESET_PASSWORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
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
    <div className="rpw-page">
      {/* Animated background orbs */}
      <div className="rpw-bg">
        <div className="rpw-orb rpw-orb--1" />
        <div className="rpw-orb rpw-orb--2" />
        <div className="rpw-orb rpw-orb--3" />
      </div>

      <div className="rpw-card">
        <div className="rpw-brand">
          <img
            src="/daylence_logo_without_title.png"
            alt="Daylence"
            className="rpw-logo"
          />
          <h1 className="rpw-title">Réinitialiser le mot de passe</h1>
        </div>

        {/* ── Invalid link ── */}
        {status === "invalid-link" && (
          <div className="rpw-result">
            <div className="rpw-result__icon rpw-result__icon--error">
              <AlertTriangle size={32} />
            </div>
            <p className="rpw-result__heading">Lien invalide</p>
            <p className="rpw-result__text">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {status === "error" && (
          <div className="rpw-result">
            <div className="rpw-result__icon rpw-result__icon--error">
              <AlertTriangle size={32} />
            </div>
            <p className="rpw-result__heading">Échec</p>
            <p className="rpw-result__text">{errorMsg}</p>
            <button
              className="rpw-btn rpw-btn--secondary"
              onClick={() => setStatus("form")}
            >
              <ArrowLeft size={16} /> Réessayer
            </button>
          </div>
        )}

        {/* ── Success ── */}
        {status === "success" && (
          <div className="rpw-result">
            <div className="rpw-result__icon rpw-result__icon--success">
              <Check size={32} />
            </div>
            <p className="rpw-result__heading">Mot de passe réinitialisé</p>
            <p className="rpw-result__text">
              Votre nouveau mot de passe est actif. Vous pouvez retourner sur
              l'application et vous connecter.
            </p>
          </div>
        )}

        {/* ── Form ── */}
        {(status === "form" || status === "loading") && (
          <>
            <p className="rpw-subtitle">
              Choisissez un nouveau mot de passe (6 caractères minimum).
            </p>

            <form className="rpw-form" onSubmit={handleSubmit}>
              <div className="rpw-field">
                <Lock size={18} className="rpw-field__icon" />
                <input
                  className="rpw-field__input"
                  type={showPw ? "text" : "password"}
                  placeholder="Nouveau mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  className="rpw-field__toggle"
                  onClick={() => setShowPw(!showPw)}
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="rpw-field">
                <Lock size={18} className="rpw-field__icon" />
                <input
                  className="rpw-field__input"
                  type={showConfirmPw ? "text" : "password"}
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="rpw-field__toggle"
                  onClick={() => setShowConfirmPw(!showConfirmPw)}
                  tabIndex={-1}
                >
                  {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {password.length >= 6 &&
                confirmPassword.length >= 1 &&
                !passwordsMatch && (
                  <p className="rpw-mismatch">
                    Les mots de passe ne correspondent pas.
                  </p>
                )}

              <button
                className="rpw-submit"
                type="submit"
                disabled={!canSubmit || status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 size={20} className="rpw-spinner" />
                ) : (
                  "Réinitialiser"
                )}
              </button>
            </form>
          </>
        )}

        <p className="rpw-footer">&copy; {new Date().getFullYear()} Daylence</p>
      </div>
    </div>
  );
}
