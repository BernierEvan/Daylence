import { MODULE_META, type TodoModule } from "../types";
import { motion } from "framer-motion";

interface Props {
  active: TodoModule;
  onChange: (m: TodoModule) => void;
}

const MODULES: TodoModule[] = [
  "overview",
  "dashboard",
  "grocery",
  "meals",
  "fridge",
  "habits",
  "braindump",
];

export default function ModuleNav({ active, onChange }: Props) {
  return (
    <nav className="td-nav" role="tablist" aria-label="Modules">
      {MODULES.map((m) => {
        const meta = MODULE_META[m];
        const isActive = m === active;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={isActive}
            className={`td-nav__item ${isActive ? "td-nav__item--active" : ""}`}
            onClick={() => onChange(m)}
          >
            {isActive && (
              <motion.span
                layoutId="nav-pill"
                className="td-nav__pill"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="td-nav__emoji">{meta.emoji}</span>
            <span className="td-nav__label">{meta.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
