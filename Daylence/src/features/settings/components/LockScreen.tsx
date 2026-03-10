import { useState, useCallback } from "react";
import { usePreferences } from "../store/preferencesStore";

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
  const pinCode = usePreferences((s) => s.pinCode);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

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

  return (
    <div className="lock">
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
                  className="lock__key"
                  onClick={() => handleKey(d)}
                >
                  {d === "del" ? "⌫" : d}
                </button>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
