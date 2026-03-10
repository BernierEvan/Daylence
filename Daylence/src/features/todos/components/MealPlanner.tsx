import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Palette, RotateCcw } from "lucide-react";
import { useTodoStore } from "../store/todoStore";
import { MEAL_LABELS, COLOR_PALETTE, type MealType } from "../types";
import { getDayLabelsFull, useFormatPrefs } from "../../../lib/utils";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

/** Internal day indices: 0=Mon always (storage convention). */
const DAYS_MON = [0, 1, 2, 3, 4, 5, 6];
const DAYS_SUN = [6, 0, 1, 2, 3, 4, 5];

export default function MealPlanner() {
  const mealSlots = useTodoStore((s) => s.mealSlots);
  const setMealSlot = useTodoStore((s) => s.setMealSlot);
  const removeMealSlot = useTodoStore((s) => s.removeMealSlot);
  const updateMealColor = useTodoStore((s) => s.updateMealColor);
  const clearAllMeals = useTodoStore((s) => s.clearAllMeals);
  const { firstDay } = useFormatPrefs();

  const DAY_LABELS = getDayLabelsFull(firstDay);
  const dayOrder = firstDay === "sunday" ? DAYS_SUN : DAYS_MON;

  const [editing, setEditing] = useState<{
    day: number;
    meal: MealType;
  } | null>(null);
  const [draft, setDraft] = useState("");
  const [pickerOpen, setPickerOpen] = useState<string | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const getSlot = (day: number, meal: MealType) =>
    mealSlots.find((s) => s.dayOfWeek === day && s.mealType === meal);

  const confirmEdit = () => {
    if (!editing) return;
    const trimmed = draft.trim();
    if (trimmed) {
      setMealSlot(editing.day, editing.meal, trimmed);
    }
    setEditing(null);
    setDraft("");
  };

  const startEdit = (day: number, meal: MealType) => {
    const existing = getSlot(day, meal);
    setDraft(existing?.title ?? "");
    setEditing({ day, meal });
  };

  return (
    <>
      <div className="td-meals">
        <div className="td-meals__header">
          <h2 className="td-section__title">Planning repas</h2>
          {mealSlots.length > 0 && (
            <button
              className="td-meals__reset"
              onClick={() => setResetOpen(true)}
              title="Tout réinitialiser"
            >
              <RotateCcw size={14} />
              Réinitialiser
            </button>
          )}
        </div>

        <div className="td-meals__grid">
          {/* header row */}
          <div className="td-meals__corner" />
          {MEAL_TYPES.map((mt) => (
            <div key={mt} className="td-meals__colhead">
              {MEAL_LABELS[mt]}
            </div>
          ))}

          {/* day rows */}
          {DAY_LABELS.map((dayLabel, i) => {
            const dayIdx = dayOrder[i];
            return (
              <div key={dayLabel} className="td-meals__row">
                <div className="td-meals__day">{dayLabel}</div>
                {MEAL_TYPES.map((mt) => {
                  const slot = getSlot(dayIdx, mt);
                  const isEditing =
                    editing?.day === dayIdx && editing?.meal === mt;

                  return (
                    <div
                      key={mt}
                      className="td-meals__cell"
                      style={
                        pickerOpen === slot?.id ? { zIndex: 50 } : undefined
                      }
                    >
                      <AnimatePresence mode="wait">
                        {isEditing ? (
                          <motion.div
                            key="edit"
                            className="td-meals__edit"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <input
                              className="td-meals__input"
                              type="text"
                              value={draft}
                              onChange={(e) => setDraft(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") confirmEdit();
                                if (e.key === "Escape") setEditing(null);
                              }}
                              autoFocus
                              placeholder="Plat…"
                            />
                          </motion.div>
                        ) : slot ? (
                          <motion.button
                            key="filled"
                            className="td-meals__slot td-meals__slot--filled"
                            onClick={() => startEdit(dayIdx, mt)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ scale: 1.03 }}
                            style={
                              slot.color
                                ? {
                                    background: `${slot.color}22`,
                                    borderColor: slot.color,
                                  }
                                : undefined
                            }
                          >
                            <span>{slot.title}</span>
                            <Palette
                              size={12}
                              className="td-meals__color-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setPickerOpen(
                                  pickerOpen === slot.id ? null : slot.id,
                                );
                              }}
                            />
                            <X
                              size={12}
                              className="td-meals__remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMealSlot(slot.id);
                              }}
                            />
                          </motion.button>
                        ) : (
                          <motion.button
                            key="empty"
                            className="td-meals__slot td-meals__slot--empty"
                            onClick={() => startEdit(dayIdx, mt)}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Plus size={14} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                      {slot && pickerOpen === slot.id && (
                        <div
                          className="td-color-picker td-color-picker--meal"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {COLOR_PALETTE.map((c) => (
                            <button
                              key={c}
                              className={`td-color-picker__dot${c === slot.color ? " td-color-picker__dot--active" : ""}`}
                              style={{ background: c }}
                              onClick={() => {
                                updateMealColor(slot.id, c);
                                setPickerOpen(null);
                              }}
                              aria-label={c}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={resetOpen}
        title="Réinitialiser le planning"
        description="Tous les repas planifiés seront supprimés. Cette action est irréversible."
        confirmLabel="Réinitialiser"
        variant="danger"
        onConfirm={clearAllMeals}
        onCancel={() => setResetOpen(false)}
      />
    </>
  );
}
