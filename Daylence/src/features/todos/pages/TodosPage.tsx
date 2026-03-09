import { AnimatePresence, motion } from "framer-motion";
import { useTodoStore } from "../store/todoStore";
import ModuleNav from "../components/TodoFilters";
import DashboardView from "../components/DashboardView";
import GroceryList from "../components/GroceryList";
import MealPlanner from "../components/MealPlanner";
import FridgeAlerts from "../components/FridgeAlerts";
import HabitTracker from "../components/HabitTracker";
import BrainDump from "../components/BrainDump";
import "../css/TodosPage.css";

const MODULE_COMPONENT: Record<string, React.FC> = {
  dashboard: DashboardView,
  grocery: GroceryList,
  meals: MealPlanner,
  fridge: FridgeAlerts,
  habits: HabitTracker,
  braindump: BrainDump,
};

export default function TodosPage() {
  const activeModule = useTodoStore((s) => s.activeModule);
  const setActiveModule = useTodoStore((s) => s.setActiveModule);

  const View = MODULE_COMPONENT[activeModule];

  return (
    <div className="td-page">
      <header className="td-page__header">
        <h1 className="td-page__logo">Daylence</h1>
      </header>

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
              <View />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
