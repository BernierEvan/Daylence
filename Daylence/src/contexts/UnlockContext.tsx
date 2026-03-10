import { createContext, useContext } from "react";

interface UnlockContextType {
  sessionUnlocked: boolean;
  unlock: () => void;
}

export const UnlockContext = createContext<UnlockContextType>({
  sessionUnlocked: true,
  unlock: () => {},
});

export const useSessionUnlock = () => useContext(UnlockContext);
