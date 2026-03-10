import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "default";
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onCancel}
        >
          <motion.div
            className="cd-dialog"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="cd-close" onClick={onCancel}>
              <X size={16} />
            </button>

            <div className="cd-body">
              {variant === "danger" && (
                <div className="cd-icon cd-icon--danger">
                  <AlertTriangle size={22} />
                </div>
              )}
              <h3 className="cd-title">{title}</h3>
              {description && <p className="cd-desc">{description}</p>}
            </div>

            <div className="cd-actions">
              <button className="cd-btn cd-btn--cancel" onClick={onCancel}>
                {cancelLabel}
              </button>
              <button
                className={`cd-btn ${variant === "danger" ? "cd-btn--danger" : "cd-btn--primary"}`}
                onClick={() => {
                  onConfirm();
                  onCancel();
                }}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
