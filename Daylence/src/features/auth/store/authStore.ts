import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../../../supabaseClient";

/* ═══════════════════════════════════════════════
   Auth Store – user session data
   Persisted in sessionStorage (cleared when browser closes).
   Populated after login from Supabase `users` table.
   ═══════════════════════════════════════════════ */

export interface AuthUser {
  id_user: string;
  email: string;
  pin: boolean;
  pin_code: string;
  lock_selection: string[]; // module ids locked behind PIN
}

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  /** Re-fetch user data from Supabase to sync local state */
  refreshUser: () => Promise<void>;
  /** Update PIN fields in DB + local state */
  enablePin: (pinCode: string, lockSelection?: string[]) => Promise<void>;
  disablePin: () => Promise<void>;
  updateLockSelection: (lockSelection: string[]) => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),

      refreshUser: async () => {
        const user = get().user;
        if (!user) return;
        const { data, error } = await supabase
          .from("users")
          .select("id_user, email, pin, pin_code, lock_selection")
          .eq("id_user", user.id_user)
          .limit(1)
          .single();
        if (error || !data) return;
        set({
          user: {
            id_user: data.id_user,
            email: data.email ?? user.email,
            pin: data.pin ?? false,
            pin_code: String(data.pin_code ?? ""),
            lock_selection: data.lock_selection ?? [],
          },
        });
      },

      enablePin: async (pinCode, lockSelection) => {
        const user = get().user;
        if (!user) return;
        const dbUpdates: Record<string, unknown> = {
          pin: true,
          pin_code: pinCode,
        };
        if (lockSelection !== undefined) {
          dbUpdates.lock_selection = lockSelection;
        }
        console.log("[Auth enablePin] Saving to DB:", {
          id_user: user.id_user,
          pin_code: pinCode,
        });
        const { error, data } = await supabase
          .from("users")
          .update(dbUpdates)
          .eq("id_user", user.id_user)
          .select();
        console.log("[Auth enablePin] DB response:", { error, data });
        if (error) {
          console.error("[Auth enablePin]", error.message);
          return;
        }
        set({
          user: {
            ...user,
            pin: true,
            pin_code: pinCode,
            ...(lockSelection !== undefined
              ? { lock_selection: lockSelection }
              : {}),
          },
        });
      },

      disablePin: async () => {
        const user = get().user;
        if (!user) return;
        const { error } = await supabase
          .from("users")
          .update({ pin: false, pin_code: "", lock_selection: [] })
          .eq("id_user", user.id_user);
        if (error) {
          console.error("[Auth disablePin]", error.message);
          return;
        }
        set({
          user: { ...user, pin: false, pin_code: "", lock_selection: [] },
        });
      },

      updateLockSelection: async (lockSelection) => {
        const user = get().user;
        if (!user) return;
        const { error } = await supabase
          .from("users")
          .update({ lock_selection: lockSelection })
          .eq("id_user", user.id_user);
        if (error) {
          console.error("[Auth updateLockSelection]", error.message);
          return;
        }
        set({ user: { ...user, lock_selection: lockSelection } });
      },
    }),
    {
      name: "daylence-auth",
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) =>
          sessionStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    },
  ),
);
