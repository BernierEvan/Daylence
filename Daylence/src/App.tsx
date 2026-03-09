import "./App.css";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
<<<<<<< Updated upstream
=======
import { BrowserRouter, Routes, Route } from "react-router-dom";
>>>>>>> Stashed changes
import LandingPage from "./features/landing/pages/LandingPage";
import DiscoverPage from "./resources/discover/pages/DiscoverPage";
import SupportPage from "./resources/support/SupportPage";
import CguPage from "./policies/cgu/pages/CguPage";
import ConfidentialityPage from "./policies/confidentiality/pages/ConfidentialityPage";
import TransportPage from "./features/transport/pages/TransportPage";
import SettingsPage from "./features/settings/pages/SettingsPage";
import ProfilePage from "./features/settings/pages/ProfilePage";
import BudgetPage from "./features/budget/pages/BudgetPage";

function App() {
  return (
<<<<<<< Updated upstream
    <>
      <LandingPage />
    </>
=======
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
//imports

function App() {
  return (
=======
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
//imports

function App() {
  return (
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/privacy-policy" element={<CguPage />} />
        <Route path="/confidentiality" element={<ConfidentialityPage />} />
        <Route path="/parameters" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
  );
}

export default App;
