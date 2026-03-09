import { useState, useRef, useEffect, useCallback, memo } from "react";
import { searchPlaces, searchJourneys } from "../services/transportApi";
import type { SncfPlace, SncfJourney, SncfSection } from "../types";
import { usePreferences } from "../../settings/store/preferencesStore";
import { fmtTime as fmtTimeUtil, getDayLabelsMin } from "../../../lib/utils";
import "../css/TransportPage.css";
import "../css/PublicTransport.css";

/* ── helpers ── */

function formatSncfTime(dt: string, timeFormat: "24h" | "12h" = "24h") {
  const t = dt.split("T")[1];
  const h = parseInt(t.slice(0, 2), 10);
  const m = t.slice(2, 4);
  if (timeFormat === "12h") {
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${m} ${period}`;
  }
  return `${t.slice(0, 2)}:${m}`;
}

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} min`;
  return m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

function toLocalDatetimeValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDateLabel(dateStr: string) {
  const [ymd] = dateStr.split("T");
  const [y, m, d] = ymd.split("-").map(Number);
  const target = new Date(y, m - 1, d);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(dayAfter.getDate() + 2);

  if (isSameDay(target, today)) return "Aujourd'hui";
  if (isSameDay(target, tomorrow)) return "Demain";

  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const months = [
    "jan.",
    "fév.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];
  return `${days[target.getDay()]} ${target.getDate()} ${months[target.getMonth()]}`;
}

function getTransportSections(journey: SncfJourney): SncfSection[] {
  return journey.sections.filter((s) => s.type === "public_transport");
}

function buildSncfConnectUrl(journey: SncfJourney): string {
  const sections = journey.sections;
  const origin = sections[0]?.from?.name ?? "";
  const dest = sections[sections.length - 1]?.to?.name ?? "";
  const dt = journey.departure_date_time; // "20260309T124900"
  const y = dt.slice(0, 4),
    mo = dt.slice(4, 6),
    d = dt.slice(6, 8);
  const h = dt.slice(9, 11),
    mi = dt.slice(11, 13);
  return `https://www.sncf-connect.com/app/home/search?departure=${encodeURIComponent(origin)}&arrival=${encodeURIComponent(dest)}&outwardDate=${y}-${mo}-${d}T${h}%3A${mi}%3A00&outwardTimeslot=${h}%3A${mi}&passengers=1.ADULT&directJourney=false`;
}

/* ── icons (static, declared outside render) ── */

const SWAP_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

const SEARCH_ICON = (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const TRAIN_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="3" width="16" height="16" rx="3" />
    <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M8 15h.01M16 15h.01" />
  </svg>
);

const ARROW_RIGHT = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const CLOCK_ICON = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const TRANSFER_ICON = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8L22 12L18 16" />
    <path d="M2 12h20M6 16L2 12L6 8" />
  </svg>
);

const TICKET_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    <path d="M13 5v2M13 17v2M13 11v2" />
  </svg>
);

const BUS_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 6v6M16 6v6M2 12h20M6 18H4a2 2 0 0 1-2-2V7c0-3 2-5 6-5h8c4 0 6 2 6 5v9a2 2 0 0 1-2 2h-2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M9 18h6" />
  </svg>
);

const TRAM_ICON = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="5" y="4" width="14" height="14" rx="3" />
    <path d="M5 11h14M9 4V2M15 4V2M8 18l-2 3M16 18l2 3M9 15h.01M15 15h.01" />
  </svg>
);

const CALENDAR_ICON = (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

function getModeIcon(physicalMode?: string) {
  if (!physicalMode) return TRAIN_ICON;
  const m = physicalMode.toLowerCase();
  if (m.includes("bus") || m.includes("coach") || m.includes("car"))
    return BUS_ICON;
  if (m.includes("tram") || m.includes("métro") || m.includes("metro"))
    return TRAM_ICON;
  return TRAIN_ICON;
}

/* ── Date & Time picker ── */

function generateCalendarDays(
  year: number,
  month: number,
  firstDay: "monday" | "sunday",
) {
  const first = new Date(year, month, 1);
  const startDay =
    firstDay === "sunday" ? first.getDay() : (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();
  const cells: { day: number; current: boolean; date: Date }[] = [];
  for (let i = startDay - 1; i >= 0; i--) {
    const d = prevDays - i;
    cells.push({ day: d, current: false, date: new Date(year, month - 1, d) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true, date: new Date(year, month, d) });
  }
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        day: d,
        current: false,
        date: new Date(year, month + 1, d),
      });
    }
  }
  return cells;
}

const MONTH_NAMES = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];
const DAY_HEADERS_MON = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

function DateTimePicker({
  value,
  onChange,
  onEnter,
}: {
  value: string;
  onChange: (v: string) => void;
  onEnter?: () => void;
}) {
  const firstDay = usePreferences((s) => s.firstDay);
  const DAY_HEADERS =
    firstDay === "sunday"
      ? ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"]
      : DAY_HEADERS_MON;
  const [calOpen, setCalOpen] = useState(false);
  const calRef = useRef<HTMLDivElement>(null);
  const timeStr = value.split("T")[1] ?? "12:00";
  const dateLabel = getDateLabel(value);
  const [datePart] = value.split("T");
  const [vy, vm, vd] = datePart.split("-").map(Number);
  const [viewYear, setViewYear] = useState(vy);
  const [viewMonth, setViewMonth] = useState(vm - 1);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node))
        setCalOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const cells = generateCalendarDays(viewYear, viewMonth, firstDay);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const pickDay = (date: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    onChange(
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${timeStr}`,
    );
    setCalOpen(false);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(`${datePart}T${e.target.value}`);
  };

  const adjustHour = (delta: number) => {
    const [h, m] = timeStr.split(":").map(Number);
    const nh = (((h + delta) % 24) + 24) % 24;
    onChange(
      `${datePart}T${String(nh).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    );
  };

  const adjustMinute = (delta: number) => {
    const [h, m] = timeStr.split(":").map(Number);
    const nm = (((m + delta) % 60) + 60) % 60;
    onChange(
      `${datePart}T${String(h).padStart(2, "0")}:${String(nm).padStart(2, "0")}`,
    );
  };

  const setQuick = (offsetDays: number, hours: number, minutes: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    d.setHours(hours, minutes, 0, 0);
    onChange(toLocalDatetimeValue(d));
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  return (
    <div className="pt-datetime" ref={calRef}>
      <span className="pt-datetime__label">Date & heure</span>
      <div className="pt-datetime__row">
        <button
          type="button"
          className={`pt-datetime__date-btn ${calOpen ? "pt-datetime__date-btn--active" : ""}`}
          onClick={() => setCalOpen((v) => !v)}
        >
          {CALENDAR_ICON}
          <span className="pt-datetime__date-label">{dateLabel}</span>
          <svg
            className={`pt-datetime__caret ${calOpen ? "pt-datetime__caret--open" : ""}`}
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <span className="pt-datetime__sep">●</span>

        <div className="pt-datetime__time-wrap">
          {CLOCK_ICON}
          <input
            type="time"
            className="pt-datetime__time-input"
            value={timeStr}
            onChange={handleTimeChange}
            onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          />
        </div>
      </div>

      {/* Inline calendar dropdown */}
      {calOpen && (
        <div className="pt-cal">
          <div className="pt-cal__nav">
            <button
              type="button"
              className="pt-cal__nav-btn"
              onClick={prevMonth}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className="pt-cal__month">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              className="pt-cal__nav-btn"
              onClick={nextMonth}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </button>
          </div>
          <div className="pt-cal__grid">
            {DAY_HEADERS.map((d) => (
              <span key={d} className="pt-cal__head">
                {d}
              </span>
            ))}
            {cells.map((c, i) => {
              const iso = `${c.date.getFullYear()}-${String(c.date.getMonth() + 1).padStart(2, "0")}-${String(c.date.getDate()).padStart(2, "0")}`;
              const isSelected = iso === datePart;
              const isToday = iso === todayStr;
              return (
                <button
                  key={i}
                  type="button"
                  className={`pt-cal__day${!c.current ? " pt-cal__day--dim" : ""}${isSelected ? " pt-cal__day--sel" : ""}${isToday && !isSelected ? " pt-cal__day--today" : ""}`}
                  onClick={() => pickDay(c.date)}
                >
                  {c.day}
                </button>
              );
            })}
          </div>

          {/* Time stepper */}
          <div className="pt-cal__time">
            <span className="pt-cal__time-label">Heure</span>
            <div className="pt-cal__time-controls">
              <div className="pt-cal__stepper">
                <button
                  type="button"
                  className="pt-cal__step-btn"
                  onClick={() => adjustHour(-1)}
                >
                  −
                </button>
                <span className="pt-cal__step-value">
                  {timeStr.split(":")[0]}h
                </span>
                <button
                  type="button"
                  className="pt-cal__step-btn"
                  onClick={() => adjustHour(1)}
                >
                  +
                </button>
              </div>
              <span className="pt-cal__time-sep">:</span>
              <div className="pt-cal__stepper">
                <button
                  type="button"
                  className="pt-cal__step-btn"
                  onClick={() => adjustMinute(-5)}
                >
                  −
                </button>
                <span className="pt-cal__step-value">
                  {timeStr.split(":")[1]}
                </span>
                <button
                  type="button"
                  className="pt-cal__step-btn"
                  onClick={() => adjustMinute(5)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick chips */}
      <div className="pt-datetime__chips">
        <button
          type="button"
          className="pt-datetime__chip"
          onClick={() => {
            const now = new Date();
            onChange(toLocalDatetimeValue(now));
            setViewYear(now.getFullYear());
            setViewMonth(now.getMonth());
          }}
        >
          Maintenant
        </button>
        <button
          type="button"
          className="pt-datetime__chip"
          onClick={() => setQuick(0, 18, 0)}
        >
          Ce soir
        </button>
        <button
          type="button"
          className="pt-datetime__chip"
          onClick={() => setQuick(1, 8, 0)}
        >
          Demain 8h
        </button>
        <button
          type="button"
          className="pt-datetime__chip"
          onClick={() => setQuick(1, 18, 0)}
        >
          Demain 18h
        </button>
      </div>
    </div>
  );
}

/* ── autocomplete input ── */

function StationInput({
  label,
  value,
  onSelect,
  placeholder,
  onEnter,
}: {
  label: string;
  value: string;
  onSelect: (place: SncfPlace) => void;
  placeholder: string;
  onEnter?: () => void;
}) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<SncfPlace[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Cleanup on unmount
  useEffect(
    () => () => {
      abortRef.current?.abort();
      clearTimeout(debounceRef.current);
    },
    [],
  );

  const fetchSuggestions = useCallback((text: string) => {
    setQuery(text);
    setActiveIdx(-1);
    clearTimeout(debounceRef.current);

    if (text.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setLoading(true);
      try {
        const res = await searchPlaces(text, ctrl.signal);
        setSuggestions(res.places ?? []);
        setOpen(true);
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError"))
          setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  }, []);

  const pick = useCallback(
    (place: SncfPlace) => {
      setQuery(place.stop_area.label || place.name);
      setSuggestions([]);
      setOpen(false);
      onSelect(place);
    },
    [onSelect],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) {
      if (e.key === "Enter") onEnter?.();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      pick(suggestions[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="pt-field" ref={wrapperRef}>
      <label className="pt-field__label">{label}</label>
      <div className="pt-field__input-wrap">
        {TRAIN_ICON}
        <input
          className="pt-field__input"
          type="text"
          value={query}
          onChange={(e) => fetchSuggestions(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {loading && <span className="pt-field__spinner" />}
      </div>
      {open && suggestions.length > 0 && (
        <ul className="pt-suggestions" role="listbox">
          {suggestions.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === activeIdx}>
              <button
                className={`pt-suggestions__item ${i === activeIdx ? "pt-suggestions__item--active" : ""}`}
                onClick={() => pick(s)}
                tabIndex={-1}
              >
                <span className="pt-suggestions__icon">{TRAIN_ICON}</span>
                <span className="pt-suggestions__text">
                  <span className="pt-suggestions__name">
                    {s.stop_area.name}
                  </span>
                  <span className="pt-suggestions__region">
                    {s.name.includes("(")
                      ? s.name.split("(").pop()?.replace(")", "")
                      : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Journey card ── */

const JourneyCard = memo(function JourneyCard({
  journey,
  index,
}: {
  journey: SncfJourney;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const timeFormat = usePreferences((s) => s.timeFormat);
  const ptSections = getTransportSections(journey);
  const dep = formatSncfTime(journey.departure_date_time, timeFormat);
  const arr = formatSncfTime(journey.arrival_date_time, timeFormat);
  const duration = formatDuration(journey.duration);
  const sections = journey.sections;
  const originName = sections[0]?.from?.name ?? "";
  const destName = sections[sections.length - 1]?.to?.name ?? "";

  return (
    <div className="pt-journey" style={{ animationDelay: `${index * 0.08}s` }}>
      <button
        className="pt-journey__main"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        <div className="pt-journey__times">
          <div className="pt-journey__time-col">
            <span className="pt-journey__time">{dep}</span>
            <span className="pt-journey__station">{originName}</span>
          </div>
          <div className="pt-journey__timeline">
            <span className="pt-journey__line" />
            <span className="pt-journey__arrow-dot" />
            <span className="pt-journey__duration-badge">
              {CLOCK_ICON} {duration}
            </span>
            <span className="pt-journey__line" />
            <svg
              className="pt-journey__arrow-head"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <path
                d="M1 1l4 4-4 4"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="pt-journey__time-col pt-journey__time-col--end">
            <span className="pt-journey__time">{arr}</span>
            <span className="pt-journey__station">{destName}</span>
          </div>
        </div>

        <div className="pt-journey__meta">
          <div className="pt-journey__trains">
            {ptSections.map((s, i) => (
              <span
                key={i}
                className="pt-journey__train-badge"
                style={
                  s.display_informations?.color
                    ? {
                        background: `#${s.display_informations.color}`,
                        color: s.display_informations.text_color
                          ? `#${s.display_informations.text_color}`
                          : "#fff",
                      }
                    : undefined
                }
              >
                {getModeIcon(s.display_informations?.physical_mode)}
                {s.display_informations?.commercial_mode ?? "Train"}
                {s.display_informations?.headsign
                  ? ` ${s.display_informations.headsign}`
                  : ""}
              </span>
            ))}
          </div>
          <span className="pt-journey__transfers">
            {TRANSFER_ICON}
            {journey.nb_transfers === 0
              ? "Direct"
              : `${journey.nb_transfers} correspondance${journey.nb_transfers > 1 ? "s" : ""}`}
          </span>
        </div>

        <svg
          className={`pt-journey__chevron ${expanded ? "pt-journey__chevron--open" : ""}`}
          width="20"
          height="20"
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

      {expanded && (
        <div className="pt-journey__details">
          {journey.sections.map((section, i) => {
            if (section.type === "public_transport") {
              const info = section.display_informations;
              const stops = section.stop_date_times ?? [];
              return (
                <div key={i} className="pt-section pt-section--transport">
                  <div className="pt-section__header">
                    <span
                      className="pt-section__mode-badge"
                      style={
                        info?.color
                          ? {
                              background: `#${info.color}`,
                              color: info.text_color
                                ? `#${info.text_color}`
                                : "#fff",
                            }
                          : undefined
                      }
                    >
                      {getModeIcon(info?.physical_mode)}
                      {info?.commercial_mode}
                      {info?.headsign ? ` n°${info.headsign}` : ""}
                    </span>
                    <span className="pt-section__direction">
                      {ARROW_RIGHT} {info?.direction}
                    </span>
                  </div>
                  <div className="pt-section__stops">
                    {stops.map((stop, j) => (
                      <div
                        key={j}
                        className={`pt-stop ${j === 0 ? "pt-stop--first" : ""} ${j === stops.length - 1 ? "pt-stop--last" : ""}`}
                      >
                        <span className="pt-stop__time">
                          {j === 0
                            ? formatSncfTime(
                                stop.departure_date_time,
                                timeFormat,
                              )
                            : j === stops.length - 1
                              ? formatSncfTime(
                                  stop.arrival_date_time,
                                  timeFormat,
                                )
                              : formatSncfTime(
                                  stop.departure_date_time,
                                  timeFormat,
                                )}
                        </span>
                        <span className="pt-stop__dot-col">
                          {j > 0 && <span className="pt-stop__line-above" />}
                          <span
                            className={`pt-stop__dot ${j === 0 || j === stops.length - 1 ? "pt-stop__dot--end" : ""}`}
                          />
                          {j < stops.length - 1 && (
                            <span className="pt-stop__line-below" />
                          )}
                        </span>
                        <span className="pt-stop__name">
                          {stop.stop_point.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (
              (section.type === "transfer" || section.type === "waiting") &&
              section.duration > 0
            ) {
              return (
                <div key={i} className="pt-section pt-section--transfer">
                  <span className="pt-section__transfer-label">
                    {section.type === "transfer"
                      ? "🚶 Correspondance"
                      : "⏳ Attente"}{" "}
                    — {formatDuration(section.duration)}
                  </span>
                </div>
              );
            }

            if (section.type === "street_network" && section.duration > 60) {
              return (
                <div key={i} className="pt-section pt-section--walk">
                  <span className="pt-section__transfer-label">
                    🚶 Marche — {formatDuration(section.duration)}
                  </span>
                </div>
              );
            }

            return null;
          })}
        </div>
      )}

      <a
        className="pt-journey__buy"
        href={buildSncfConnectUrl(journey)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {TICKET_ICON}
        <span>Acheter ce billet</span>
      </a>
    </div>
  );
});

/* ── Main page ── */

export default function PublicTransport() {
  const [fromPlace, setFromPlace] = useState<SncfPlace | null>(null);
  const [toPlace, setToPlace] = useState<SncfPlace | null>(null);
  const [fromLabel, setFromLabel] = useState("");
  const [toLabel, setToLabel] = useState("");
  const [datetime, setDatetime] = useState(toLocalDatetimeValue(new Date()));
  const [journeys, setJourneys] = useState<SncfJourney[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Cleanup pending journey search on unmount
  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  const swap = () => {
    setFromPlace(toPlace);
    setToPlace(fromPlace);
    setFromLabel(toLabel);
    setToLabel(fromLabel);
  };

  const handleSearch = useCallback(async () => {
    if (!fromPlace || !toPlace) {
      setError("Veuillez sélectionner un départ et une destination.");
      return;
    }
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setError("");
    setLoading(true);
    setSearched(true);
    try {
      const sncfDt = datetime.replace(/[-:]/g, "");
      const padded = sncfDt.length < 15 ? sncfDt + "00" : sncfDt;
      const res = await searchJourneys(
        fromPlace.stop_area.id,
        toPlace.stop_area.id,
        padded,
        ctrl.signal,
      );
      setJourneys(res.journeys ?? []);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError("Impossible de récupérer les trajets. Réessayez plus tard.");
      setJourneys([]);
    } finally {
      setLoading(false);
    }
  }, [fromPlace, toPlace, datetime]);

  return (
    <div className="transport-page">
      {/* ── Header ── */}
      <header className="transport-header">
        <a href="/" className="transport-header__brand">
          <img
            src="/daylence_logo_without_title.png"
            alt="Daylence"
            className="transport-header__logo"
          />
          <span className="transport-header__title">Daylence</span>
        </a>
        <nav className="transport-header__nav">
          <a href="/" className="transport-header__link">
            Accueil
          </a>
          <a href="/transport" className="transport-header__link">
            Transport
          </a>
          <a href="/discover" className="transport-header__link">
            Découvrir
          </a>
          <a href="/support" className="transport-header__link">
            Support
          </a>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="pt-hero">
        <div className="pt-hero__icon-wrap">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="3" width="16" height="16" rx="3" />
            <path d="M4 11h16M12 3v8M8 19l-2 3M16 19l2 3M8 15h.01M16 15h.01" />
          </svg>
        </div>
        <h1 className="pt-hero__title">Transport en commun</h1>
        <p className="pt-hero__sub">
          Recherchez des trajets train, bus et transport en commun en temps
          réel.
        </p>
      </section>

      {/* ── Search form ── */}
      <section className="pt-search">
        <div className="pt-search__card">
          <div className="pt-search__fields">
            <StationInput
              label="Départ"
              value={fromLabel}
              onSelect={(p) => {
                setFromPlace(p);
                setFromLabel(p.stop_area.label || p.name);
              }}
              placeholder="Gare de départ…"
              onEnter={handleSearch}
            />

            <button
              className="pt-swap-btn"
              onClick={swap}
              title="Inverser"
              aria-label="Inverser départ et destination"
            >
              {SWAP_ICON}
            </button>

            <StationInput
              label="Destination"
              value={toLabel}
              onSelect={(p) => {
                setToPlace(p);
                setToLabel(p.stop_area.label || p.name);
              }}
              placeholder="Gare d'arrivée…"
              onEnter={handleSearch}
            />
            <DateTimePicker
              value={datetime}
              onChange={setDatetime}
              onEnter={handleSearch}
            />
          </div>

          <button
            className="pt-search__btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <span className="pt-search__btn-spinner" />
            ) : (
              <>
                {SEARCH_ICON}
                <span>Rechercher</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="pt-results">
        {error && <p className="pt-results__error">{error}</p>}

        {loading && (
          <div className="pt-results__loading">
            <span className="pt-results__loading-spinner" />
            <p>Recherche des trajets…</p>
          </div>
        )}

        {!loading && searched && journeys.length === 0 && !error && (
          <div className="pt-results__empty">
            <p>Aucun trajet trouvé pour cette recherche.</p>
          </div>
        )}

        {!loading &&
          journeys.map((j, i) => (
            <JourneyCard
              key={`${j.departure_date_time}-${j.arrival_date_time}-${i}`}
              journey={j}
              index={i}
            />
          ))}
      </section>

      {/* ── Footer ── */}
      <footer className="transport-footer">
        <div className="transport-footer__inner">
          <span className="transport-footer__copy">
            &copy; {new Date().getFullYear()} Daylence
          </span>
          <div className="transport-footer__links">
            <a href="/privacy-policy">Confidentialité</a>
            <a href="/support">Aide</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
