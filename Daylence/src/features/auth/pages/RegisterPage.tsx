import { useState } from "react";
import type { FormEvent } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../store/authStore";
import "../css/LoginPage.css";

const FORGOT_PASSWORD_WEBHOOK_URL =
  "https://n8n.srv1455737.hstgr.cloud/webhook/confirm-account-creation";

type LoginProps = {
  setToken: (token: { token: string }) => void;
};

export default function Login({ setToken }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const setUser = useAuth((s) => s.setUser);

  const handleForgotPassword = async () => {
    if (forgotLoading || forgotSent) return;
    if (!email) {
      setErrorMessage(
        "Entrez votre e-mail pour réinitialiser le mot de passe.",
      );
      return;
    }
    setForgotLoading(true);
    setErrorMessage("");
    try {
      await fetch(FORGOT_PASSWORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setForgotSent(true);
    } catch {
      setForgotSent(true);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("users")
      .select("id_user, email, pin, pin_code, lock_selection")
      .eq("email", email)
      .eq("password", password)
      .limit(1);

    setLoading(false);

    if (error) {
      console.error(error);
      setErrorMessage("Erreur de connexion. Réessayez.");
      return;
    }

    if (!data || data.length === 0) {
      setErrorMessage("Email ou mot de passe incorrect");
      return;
    }

    const row = data[0];
    console.log("[Login] DB row:", {
      pin: row.pin,
      pin_code: row.pin_code,
      lock_selection: row.lock_selection,
    });

    // ── Ensure a profile exists for this user ──
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id_profile")
      .eq("id_user", row.id_user)
      .limit(1)
      .single();

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        id_profile: crypto.randomUUID(),
        id_user: row.id_user,
        name: row.email ?? "Mon profil",
      });
    }

    setUser({
      id_user: row.id_user,
      email: row.email ?? "",
      pin: row.pin ?? false,
      pin_code: String(row.pin_code ?? ""),
      lock_selection: row.lock_selection ?? [],
    });

    setToken({ token: "connected" });
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-bg">
        <div className="login-orb login-orb--1" />
        <div className="login-orb login-orb--2" />
        <div className="login-orb login-orb--3" />
      </div>

      <div className="login-card">
        <div className="login-brand">
          <img
            src="/3d_daylence_logo.png"
            alt="Daylence"
            className="login-logo"
          />
          <h1 className="login-title">Daylence</h1>
          <p className="login-subtitle">Connectez-vous pour continuer</p>
        </div>

        {errorMessage && (
          <div className="login-error">
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <Mail size={18} className="login-field__icon" />
            <input
              className="login-field__input"
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="login-field">
            <Lock size={18} className="login-field__icon" />
            <input
              className="login-field__input"
              type={showPw ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="login-field__toggle"
              onClick={() => setShowPw(!showPw)}
              tabIndex={-1}
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            className="login-submit"
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <Loader2 size={20} className="login-spinner" />
            ) : (
              <>
                Se connecter
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <button
          className="login-forgot"
          onClick={handleForgotPassword}
          disabled={forgotSent || forgotLoading}
          type="button"
        >
          {forgotLoading
            ? "Envoi…"
            : forgotSent
              ? "E-mail envoyé ✓"
              : "Mot de passe oublié ?"}
        </button>

        <p className="login-footer">
          &copy; {new Date().getFullYear()} Daylence
        </p>
      </div>
    </div>
  );
}
