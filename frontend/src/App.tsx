import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FaSnowflake, FaBook, FaListAlt, FaShoppingCart, FaCarrot } from "react-icons/fa";
import TabBar from "./components/TabBar";
import Fridge from "./pages/Fridge";
import Recipes from "./pages/Recipes";
import Menu from "./pages/Menu";
import ShoppingList from "./pages/ShoppingList";
import Ingredients from "./pages/Ingredients";
import "./App.css";

const TABS = [
  { label: "Ingredients", path: "/ingredients", icon: <FaCarrot /> },
  { label: "Recipes", path: "/recipes", icon: <FaBook /> },
  { label: "Menu", path: "/menu", icon: <FaListAlt /> },
  { label: "Fridge", path: "/fridge", icon: <FaSnowflake /> },
  { label: "Shopping List", path: "/shopping-list", icon: <FaShoppingCart /> },
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = TABS.find(tab => location.pathname.startsWith(tab.path))?.label || TABS[0].label;

  return (
    <div className="app-fullscreen-layout">
      <nav className="sidebar-nav">
        <TabBar
          tabs={TABS.map(t => t.label)}
          icons={TABS.map(t => t.icon)}
          current={currentTab}
          onTabChange={tab => {
            const found = TABS.find(t => t.label === tab);
            if (found) navigate(found.path);
          }}
          orientation="vertical"
        />
      </nav>
      <main className="main-content">
        <Routes>
          <Route path="/fridge" element={<Fridge />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/shopping-list" element={<ShoppingList />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="*" element={<Navigate to="/ingredients" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
