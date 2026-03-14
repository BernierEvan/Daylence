import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTodoStore } from "../store/todoStore";
import { useAuth } from "../../auth/store/authStore";
import PageHeader from "../../../components/layout/PageHeader";
import ModuleNav from "../components/TodoFilters";
import OverviewView from "../components/OverviewView";
import DashboardView from "../components/DashboardView";
import GroceryList from "../components/GroceryList";
import MealPlanner from "../components/MealPlanner";
import FridgeAlerts from "../components/FridgeAlerts";
import HabitTracker from "../components/HabitTracker";
import BrainDump from "../components/BrainDump";
import "../css/TodosPage.css";

export default function TodosPage() {
  const userId = useAuth((s) => s.user?.id_user);
  const init = useTodoStore((s) => s.init);
  const loading = useTodoStore((s) => s.loading);
  const activeModule = useTodoStore((s) => s.activeModule);
  const setActiveModule = useTodoStore((s) => s.setActiveModule);

  useEffect(() => {
    if (userId) init(userId);
  }, [userId, init]);

  const renderView = () => {
    switch (activeModule) {
      case "overview":
        return <OverviewView onNavigate={setActiveModule} />;
      case "dashboard":
        return <DashboardView />;
      case "grocery":
        return <GroceryList />;
      case "meals":
        return <MealPlanner />;
      case "fridge":
        return <FridgeAlerts />;
      case "habits":
        return <HabitTracker />;
      case "braindump":
        return <BrainDump />;
    }
  };

  if (loading) {
    return (
      <div className="td-page">
        <PageHeader />
        <div className="td-page__loading">Chargement…</div>
      </div>
    );
  }

  return (
    <div className="td-page">
      <PageHeader />

      <div className="td-page__layout">
        <ModuleNav active={activeModule} onChange={setActiveModule} />

        <main className="td-page__main">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="td-page__view"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
