import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Crown,
  Zap,
  Shield,
  TrendingUp,
  Plus,
  X,
  Train,
  ArrowRightLeft,
  RefreshCw,
  Trash2,
  Clock,
} from "lucide-react";
import {
  useWidgetStore,
  WIDGET_CATALOGUE,
  type WidgetInstance,
  type TrajetConfig,
} from "../store/widgetStore";
import {
  searchPlaces,
  searchJourneys,
} from "../../transport/services/transportApi";
import { usePreferences } from "../../settings/store/preferencesStore";
import { fmtTime as fmtTimeUtil } from "../../../lib/utils";
import type { SncfPlace, SncfJourney } from "../../transport/types";

const MODULES = [
  {
    id: "recipes",
    emoji: "🍳",
    label: "Recettes",
    color: "#E2C336",
    logo: "/daylence_recipe_logo.png",
    href: "/recipes",
  },
  {
    id: "sleep",
    emoji: "😴",
    label: "Sommeil",
    color: "#2875A0",
    logo: "/daylence_sleep_logo.png",
    href: "/sleep",
  },
  {
    id: "transport",
    emoji: "🚆",
    label: "Transport",
    color: "#D97D37",
    logo: "/daylence_transport_logo.png",
    href: "/transport",
  },
  {
    id: "budget",
    emoji: "💰",
    label: "Budget",
    color: "#683982",
    logo: "/daylence_budget_logo.png",
    href: "/budget",
  },
  {
    id: "work",
    emoji: "💼",
    label: "Travail",
    color: "#5B994D",
    logo: "/daylence_work_logo.png",
    href: "/work",
  },
  {
    id: "todos",
    emoji: "✅",
    label: "To-do",
    color: "#B02736",
    logo: "/daylence_task_logo.png",
    href: "/todos",
  },
  {
    id: "appblock",
    emoji: "🔒",
    label: "Bloqueur",
    color: "#1a1a2e",
    logo: "/daylence_core_logo.png",
    href: "/app-blocker",
  },
];

/* ── Helpers ── */

function parseSncfDatetime(dt: string): Date {
  // "20260309T124900" → Date
  const y = +dt.slice(0, 4);
  const m = +dt.slice(4, 6) - 1;
  const d = +dt.slice(6, 8);
  const h = +dt.slice(9, 11);
  const min = +dt.slice(11, 13);
  const s = +dt.slice(13, 15);
  return new Date(y, m, d, h, min, s);
}

function fmtTimeSncf(dt: string, timeFormat: "24h" | "12h") {
  const d = parseSncfDatetime(dt);
  return fmtTimeUtil(d, timeFormat);
}

function fmtDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m} min`;
}

function minutesUntil(dt: string) {
  return Math.max(
    0,
    Math.round((parseSncfDatetime(dt).getTime() - Date.now()) / 60000),
  );
}

/* ── Station autocomplete input ── */

function StationInput({
  label,
  value,
  onSelect,
}: {
  label: string;
  value: string;
  onSelect: (place: SncfPlace) => void;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<SncfPlace[]>([]);
  const [open, setOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleChange = useCallback(async (q: string) => {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await searchPlaces(q, ctrl.signal);
      setResults(res.places ?? []);
      setOpen(true);
    } catch {
      /* aborted */
    }
  }, []);

  return (
    <div className="tw-station">
      <span className="tw-station__label">{label}</span>
      <input
        className="tw-station__input"
        placeholder="Gare…"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
      />
      {open && results.length > 0 && (
        <ul className="tw-station__list">
          {results.map((p) => (
            <li
              key={p.id}
              className="tw-station__item"
              onMouseDown={() => {
                onSelect(p);
                setQuery(p.stop_area.label);
                setOpen(false);
              }}
            >
              <Train size={14} />
              <span>{p.stop_area.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Trajet Widget ── */

function TrajetWidget({ widget }: { widget: WidgetInstance }) {
  const configureTrajet = useWidgetStore((s) => s.configureTrajet);
  const removeWidget = useWidgetStore((s) => s.removeWidget);

  const [fromPlace, setFromPlace] = useState<SncfPlace | null>(null);
  const [toPlace, setToPlace] = useState<SncfPlace | null>(null);

  const config = widget.config;

  // ── Configured mode: real-time departures ──
  if (config) {
    return (
      <TrajetLive
        widgetId={widget.id}
        config={config}
        onRemove={() => removeWidget(widget.id)}
        onReconfigure={() => configureTrajet(widget.id, null!)}
      />
    );
  }

  // ── Configuration mode ──
  const canSave = fromPlace && toPlace;

  return (
    <div className="lp-w tw tw--setup">
      <div className="tw__header">
        <h3 className="lp-w__title">
          <Train size={16} /> Nouveau trajet
        </h3>
        <button className="tw__remove" onClick={() => removeWidget(widget.id)}>
          <Trash2 size={15} />
        </button>
      </div>

      <div className="tw__fields">
        <StationInput label="Départ" value="" onSelect={setFromPlace} />
        <StationInput label="Arrivée" value="" onSelect={setToPlace} />
      </div>

      <button
        className="tw__save"
        disabled={!canSave}
        onClick={() => {
          if (!fromPlace || !toPlace) return;
          configureTrajet(widget.id, {
            fromId: fromPlace.stop_area.id,
            fromLabel: fromPlace.stop_area.label,
            toId: toPlace.stop_area.id,
            toLabel: toPlace.stop_area.label,
          });
        }}
      >
        Suivre ce trajet
      </button>
    </div>
  );
}

/* ── Real-time journey display ── */

function TrajetLive({
  widgetId,
  config,
  onRemove,
  onReconfigure,
}: {
  widgetId: string;
  config: TrajetConfig;
  onRemove: () => void;
  onReconfigure: () => void;
}) {
  const configureTrajet = useWidgetStore((s) => s.configureTrajet);
  const [journeys, setJourneys] = useState<SncfJourney[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewIdx, setViewIdx] = useState(0);
  const [, setTick] = useState(0); // force re-render every minute
  const timeFormat = usePreferences((s) => s.timeFormat);

  const fetchJourneys = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError("");
      try {
        const now = new Date().toISOString().slice(0, 19).replace("T", "T");
        const res = await searchJourneys(
          config.fromId,
          config.toId,
          now,
          signal,
        );
        const upcoming = (res.journeys ?? [])
          .filter(
            (j) =>
              parseSncfDatetime(j.departure_date_time).getTime() > Date.now(),
          )
          .slice(0, 5);
        setJourneys(upcoming);
        setViewIdx(0);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError("Impossible de charger les trajets");
      } finally {
        setLoading(false);
      }
    },
    [config.fromId, config.toId],
  );

  // Auto-refresh every 60s
  useEffect(() => {
    const ctrl = new AbortController();
    fetchJourneys(ctrl.signal);
    const interval = setInterval(() => fetchJourneys(), 60000);
    return () => {
      ctrl.abort();
      clearInterval(interval);
    };
  }, [fetchJourneys]);

  // Countdown tick every 30s
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const journey = journeys[viewIdx];

  // Swap departure/arrival
  const handleSwap = () => {
    configureTrajet(widgetId, {
      fromId: config.toId,
      fromLabel: config.toLabel,
      toId: config.fromId,
      toLabel: config.fromLabel,
    });
  };

  return (
    <div className="lp-w tw tw--live">
      <div className="tw__header">
        <div className="tw__route">
          <span className="tw__route-station">{config.fromLabel}</span>
          <button className="tw__swap" onClick={handleSwap} title="Inverser">
            <ArrowRightLeft size={14} />
          </button>
          <span className="tw__route-station">{config.toLabel}</span>
        </div>
        <div className="tw__actions">
          <button
            className="tw__action"
            onClick={() => fetchJourneys()}
            title="Rafraîchir"
          >
            <RefreshCw size={14} />
          </button>
          <button
            className="tw__action"
            onClick={onReconfigure}
            title="Reconfigurer"
          >
            <Train size={14} />
          </button>
          <button
            className="tw__action tw__action--danger"
            onClick={onRemove}
            title="Supprimer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {loading && journeys.length === 0 && (
        <div className="tw__loading">
          <RefreshCw size={18} className="tw__spin" />
          <span>Chargement…</span>
        </div>
      )}

      {error && <p className="tw__error">{error}</p>}

      {!loading && journeys.length === 0 && !error && (
        <p className="tw__empty">Aucun départ à venir</p>
      )}

      {journey && (
        <>
          {/* Departure selector */}
          {journeys.length > 1 && (
            <div className="tw__tabs">
              {journeys.map((j, i) => (
                <button
                  key={i}
                  className={`tw__tab ${i === viewIdx ? "tw__tab--active" : ""}`}
                  onClick={() => setViewIdx(i)}
                >
                  <Clock size={12} />
                  {fmtTimeSncf(j.departure_date_time, timeFormat)}
                </button>
              ))}
            </div>
          )}

          <div className="tw__journey">
            {/* Countdown */}
            <div className="tw__countdown">
              <span className="tw__countdown-value">
                {minutesUntil(journey.departure_date_time)}
              </span>
              <span className="tw__countdown-unit">min</span>
            </div>

            {/* Times */}
            <div className="tw__times">
              <div className="tw__time-row">
                <span className="tw__time-label">Départ</span>
                <span className="tw__time-value">
                  {fmtTimeSncf(journey.departure_date_time, timeFormat)}
                </span>
              </div>
              <div className="tw__time-row">
                <span className="tw__time-label">Arrivée</span>
                <span className="tw__time-value">
                  {fmtTimeSncf(journey.arrival_date_time, timeFormat)}
                </span>
              </div>
            </div>

            {/* Sections ribbon */}
            <div className="tw__sections">
              {journey.sections
                .filter((s) => s.type === "public_transport")
                .map((s, i) => (
                  <div
                    key={i}
                    className="tw__section"
                    style={
                      {
                        "--sec-color": s.display_informations?.color
                          ? `#${s.display_informations.color}`
                          : "var(--d-accent)",
                      } as React.CSSProperties
                    }
                  >
                    <span className="tw__section-mode">
                      {s.display_informations?.commercial_mode ?? "Train"}
                    </span>
                    <span className="tw__section-name">
                      {s.display_informations?.headsign ??
                        s.display_informations?.label ??
                        ""}
                    </span>
                    <span className="tw__section-dir">
                      → {s.display_informations?.direction ?? ""}
                    </span>
                  </div>
                ))}
            </div>

            {/* Footer info */}
            <div className="tw__footer">
              <span className="tw__duration">
                <Clock size={13} /> {fmtDuration(journey.duration)}
              </span>
              {journey.nb_transfers > 0 && (
                <span className="tw__transfers">
                  {journey.nb_transfers} correspondance
                  {journey.nb_transfers > 1 ? "s" : ""}
                </span>
              )}
              {journey.nb_transfers === 0 && (
                <span className="tw__direct">Direct</span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Main component ── */
export default function Hero() {
  const navigate = useNavigate();
  const [showPicker, setShowPicker] = useState(false);
  const widgets = useWidgetStore((s) => s.widgets);
  const addWidget = useWidgetStore((s) => s.addWidget);

  /* ── Preferences ── */
  const modules = usePreferences((s) => s.modules);
  const hiddenModules = usePreferences((s) => s.hiddenModules);

  /* Build sorted, visible module list */
  const visibleModules = modules
    .filter((m) => m.visible && !hiddenModules.includes(m.id))
    .map((m) => {
      const base = MODULES.find((bm) => bm.id === m.id);
      if (!base) return null;
      return { ...base, favorited: m.favorited };
    })
    .filter(Boolean) as ((typeof MODULES)[number] & { favorited: boolean })[];

  /* Favorites first */
  visibleModules.sort((a, b) =>
    a.favorited === b.favorited ? 0 : a.favorited ? -1 : 1,
  );

  return (
    <main className="lp-body">
      {/* ── Left: Subscription ── */}
      <aside className="lp-sub">
        <div className="lp-sub__glow" />
        <div className="lp-sub__badge">
          <Crown size={14} />
          <span>Free</span>
        </div>
        <h2 className="lp-sub__title">Passez à Pro&nbsp;✨</h2>
        <p className="lp-sub__desc">
          Débloquez tout et profitez d'une expérience sans limites.
        </p>
        <ul className="lp-sub__perks">
          <li>
            <Zap size={15} /> Modules illimités
          </li>
          <li>
            <Shield size={15} /> Sync cloud
          </li>
          <li>
            <TrendingUp size={15} /> Stats avancées
          </li>
          <li>
            <Crown size={15} /> Support prioritaire
          </li>
        </ul>
        <a href="/pricing" className="lp-sub__cta">
          Voir les offres&nbsp;&rarr;
        </a>
      </aside>

      {/* ── Center: Widgets ── */}
      <section className="lp-widgets">
        <div className="lp-widgets__header">
          <h2 className="lp-widgets__title">Mes widgets</h2>
          <button
            className="lp-widgets__add"
            onClick={() => setShowPicker(!showPicker)}
            aria-label="Ajouter un widget"
          >
            {showPicker ? <X size={18} /> : <Plus size={18} />}
          </button>
        </div>

        {/* Widget catalogue picker */}
        {showPicker && (
          <div className="lp-picker">
            {WIDGET_CATALOGUE.map((w) => (
              <button
                key={w.type}
                className="lp-picker__item"
                onClick={() => {
                  addWidget(w.type);
                  setShowPicker(false);
                }}
              >
                <span>{w.emoji}</span>
                <span className="lp-picker__label">{w.label}</span>
                <span className="lp-picker__desc">{w.description}</span>
              </button>
            ))}
          </div>
        )}

        {/* Active widget instances */}
        <div className="lp-widgets__list">
          {widgets.map((w) => {
            if (w.type === "trajet")
              return <TrajetWidget key={w.id} widget={w} />;
            return null;
          })}
          {widgets.length === 0 && !showPicker && (
            <div className="lp-widgets__empty">
              <span>🫥</span>
              <p>
                Aucun widget — cliquez sur <strong>+</strong> pour en ajouter !
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Right: Modules ── */}
      <nav className="lp-modules">
        <h2 className="lp-modules__title">Modules</h2>
        <div className="lp-modules__list">
          {visibleModules.map((m) => (
            <button
              key={m.id}
              className="lp-mod"
              style={{ "--mod-color": m.color } as React.CSSProperties}
              onClick={() => navigate(m.href)}
            >
              <img src={m.logo} alt="" className="lp-mod__logo" />
              <span className="lp-mod__label">{m.label}</span>
              {m.favorited && <span className="lp-mod__star">⭐</span>}
              <span className="lp-mod__arrow">&rarr;</span>
            </button>
          ))}
        </div>
      </nav>
    </main>
  );
}
