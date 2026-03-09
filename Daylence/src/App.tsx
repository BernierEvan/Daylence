import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import Preferences from "./components/Preferences/Preferences";
import ThemeProvider from "./features/settings/components/ThemeProvider";
import LockScreen from "./features/settings/components/LockScreen";
import { usePreferences } from "./features/settings/store/preferencesStore";

function AppContent() {
  const pinEnabled = usePreferences((s) => s.pinEnabled);
  const [unlocked, setUnlocked] = useState(!pinEnabled);

  if (pinEnabled && !unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/transport" element={<TransportPage />} />
      <Route path="/transport/public" element={<PublicTransport />} />
      <Route path="/budget" element={<BudgetPage />} />
      <Route path="/todos" element={<TodosPage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/privacy-policy" element={<CguPage />} />
      <Route path="/confidentiality" element={<ConfidentialityPage />} />
      <Route path="/parameters" element={<Preferences />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
