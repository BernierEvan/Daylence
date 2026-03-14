import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "../../auth/store/authStore";

/* ── Webhook URL for forgot-PIN requests ── */
const FORGOT_PIN_WEBHOOK_URL =
  "https://n8n.srv1455737.hstgr.cloud/webhook/reset-pin-request";

/* ═══════════════════════════════════════════════
   LockScreen – PIN gate shown on app launch.
   ═══════════════════════════════════════════════ */

export default function LockScreen({
  onUnlock,
  subtitle,
}: {
  onUnlock: () => void;
  subtitle?: string;
}) {
  const pinCode = useAuth((s) => s.user?.pin_code ?? "");
  const userEmail = useAuth((s) => s.user?.email ?? "");
  const userId = useAuth((s) => s.user?.id_user ?? "");
  const refreshUser = useAuth((s) => s.refreshUser);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  // Sync PIN from DB on mount (handles reset-pin done externally)
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // If PIN is enabled but pin_code is empty/corrupted, auto-unlock
  useEffect(() => {
    if (!pinCode) onUnlock();
  }, [pinCode, onUnlock]);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKey = useCallback(
    (digit: string) => {
      if (digit === "del") {
        setInput((p) => p.slice(0, -1));
        setError(false);
        return;
      }
      const next = input + digit;
      if (next.length < pinCode.length) {
        setInput(next);
        setError(false);
      } else if (next.length === pinCode.length) {
        if (next === pinCode) {
          onUnlock();
        } else {
          setError(true);
          setInput("");
        }
      }
    },
    [input, pinCode, onUnlock],
  );

  /* ── Keyboard support ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") {
        handleKey(e.key);
      } else if (e.key === "Backspace") {
        handleKey("del");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  /* ── Auto-focus container so keyboard works immediately ── */
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  /* ── Forgot PIN handler ── */
  const handleForgotPin = async () => {
    if (forgotSent || forgotLoading || !userEmail || !userId) return;
    setForgotLoading(true);
    try {
      await fetch(FORGOT_PIN_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, userId }),
      });
      setForgotSent(true);
    } catch {
      // Silently handle — show sent state anyway to avoid info leak
      setForgotSent(true);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="lock" ref={containerRef} tabIndex={-1}>
      <div className="lock__card">
        <img
          src="/daylence_logo_without_title.png"
          alt=""
          className="lock__logo"
        />
        <h1 className="lock__title">Daylence</h1>
        <p className="lock__sub">{subtitle || "Entrez votre code PIN"}</p>

        <div className="lock__dots">
          {Array.from({ length: pinCode.length }).map((_, i) => (
            <span
              key={i}
              className={`lock__dot ${i < input.length ? "lock__dot--filled" : ""} ${error ? "lock__dot--error" : ""}`}
            />
          ))}
        </div>

        {error && <p className="lock__error">Code incorrect</p>}

        <div className="lock__pad">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map(
            (d, i) =>
              d === "" ? (
                <span key={i} />
              ) : (
                <button
                  key={i}
                  className={`lock__key ${d === "del" ? "lock__key--delete" : ""}`}
                  onClick={() => handleKey(d)}
                >
                  {d === "del" ? "⌫" : d}
                </button>
              ),
          )}
        </div>

        <button
          className="lock__forgot"
          onClick={handleForgotPin}
          disabled={forgotSent || forgotLoading}
        >
          {forgotLoading
            ? "Envoi…"
            : forgotSent
              ? "Demande envoyée ✓"
              : "PIN oublié ?"}
        </button>
      </div>
    </div>
  );
}
