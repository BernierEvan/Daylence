import "./App.css";
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import LandingPage from "./features/landing/pages/LandingPage";
import DiscoverPage from "./resources/discover/pages/DiscoverPage";
import SupportPage from "./resources/support/SupportPage";
import CguPage from "./policies/cgu/pages/CguPage";
import ConfidentialityPage from "./policies/confidentiality/pages/ConfidentialityPage";
import TransportPage from "./features/transport/pages/TransportPage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import ProfilePage from "./features/settings/pages/ProfilePage";
import BudgetPage from "./features/budget/pages/BudgetPage";
import PublicTransport from "./features/transport/pages/PublicTransport";
import TodosPage from "./features/todos/pages/TodosPage";
import RecipesPage from "./features/recipes/pages/RecipesPage";
import SleepPage from "./features/sleep/pages/SleepPage";
import WorkPage from "./features/work/pages/WorkPage";
import Preferences from "./components/Preferences/Preferences";
import ThemeProvider from "./features/settings/components/ThemeProvider";
import LockScreen from "./features/settings/components/LockScreen";
import LoginPage from "./features/auth/pages/LoginPage";
import { usePreferences } from "./features/settings/store/preferencesStore";
import { UnlockContext } from "./contexts/UnlockContext";

type AuthToken = {
  token: string;
};

function getToken(): AuthToken | null {
  const tokenString = sessionStorage.getItem("token");

  if (!tokenString) {
    return null;
  }

  try {
    return JSON.parse(tokenString) as AuthToken;
  } catch {
    return null;
  }
}

/* ── Module gate: locks individual modules in "apps" PIN mode ── */
function ModuleGate({
  moduleId,
  children,
}: {
  moduleId: string;
  children: React.ReactNode;
}) {
  const pinEnabled = usePreferences((s) => s.pinEnabled);
  const pinMode = usePreferences((s) => s.pinMode);
  const hiddenModules = usePreferences((s) => s.hiddenModules);
  const { sessionUnlocked, unlock } = React.useContext(UnlockContext);

  if (
    pinEnabled &&
    pinMode === "apps" &&
    hiddenModules.includes(moduleId) &&
    !sessionUnlocked
  ) {
    return <LockScreen onUnlock={unlock} subtitle="Module verrouillé" />;
  }

  return <>{children}</>;
}

function AppContent() {
  const pinEnabled = usePreferences((s) => s.pinEnabled);
  const pinMode = usePreferences((s) => s.pinMode);
  const defaultPage = usePreferences((s) => s.defaultPage);
  const [sessionUnlocked, setSessionUnlocked] = useState(!pinEnabled);

  const unlock = () => setSessionUnlocked(true);

  // Full lock mode: gate everything on site entry / refresh
  if (pinEnabled && pinMode === "full" && !sessionUnlocked) {
    return <LockScreen onUnlock={unlock} />;
  }

  return (
    <UnlockContext.Provider value={{ sessionUnlocked, unlock }}>
      <Routes>
        <Route
          path="/"
          element={
            defaultPage && defaultPage !== "/" ? (
              <Navigate to={defaultPage} replace />
            ) : (
              <LandingPage />
            )
          }
        />
        <Route path="/home" element={<LandingPage />} />
        <Route
          path="/transport"
          element={
            <ModuleGate moduleId="transport">
              <TransportPage />
            </ModuleGate>
          }
        />
        <Route
          path="/transport/public"
          element={
            <ModuleGate moduleId="transport">
              <PublicTransport />
            </ModuleGate>
          }
        />
        <Route
          path="/budget"
          element={
            <ModuleGate moduleId="budget">
              <BudgetPage />
            </ModuleGate>
          }
        />
        <Route
          path="/todos"
          element={
            <ModuleGate moduleId="todos">
              <TodosPage />
            </ModuleGate>
          }
        />
        <Route
          path="/recipes"
          element={
            <ModuleGate moduleId="recipes">
              <RecipesPage />
            </ModuleGate>
          }
        />
        <Route
          path="/sleep"
          element={
            <ModuleGate moduleId="sleep">
              <SleepPage />
            </ModuleGate>
          }
        />
        <Route
          path="/work"
          element={
            <ModuleGate moduleId="work">
              <WorkPage />
            </ModuleGate>
          }
        />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy-policy" element={<CguPage />} />
        <Route path="/confidentiality" element={<ConfidentialityPage />} />
        <Route path="/parameters" element={<Preferences />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </UnlockContext.Provider>
  );
}

function App() {
  const reduceAnimations = usePreferences((s) => s.reduceAnimations);
  const [authToken, setAuthToken] = useState<AuthToken | null>(() =>
    getToken(),
  );

  const setToken = (userToken: AuthToken) => {
    sessionStorage.setItem("token", JSON.stringify(userToken));
    setAuthToken(userToken);
  };

  if (!authToken?.token) {
    return <LoginPage setToken={setToken} />;
  }

  return (
    <MotionConfig reducedMotion={reduceAnimations ? "always" : "never"}>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </MotionConfig>
  );
}

export default App;
