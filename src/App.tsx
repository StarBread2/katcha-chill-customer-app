import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
//ONBOARDING
import Onboarding1 from "./pages/Onboarding/Onboarding1.tsx";
import Login from "./pages/Onboarding/Login.tsx";

//MAIN
import Dashboard from "./pages/Dashboard.tsx";
import MyProgress from "./pages/MyProgress.tsx";
import Store from "./pages/Store.tsx";

//SETTINGS
import CrowdDetails from "./pages/CrowdDetails.tsx";

//CHECKIN
import CheckIn from "./pages/CheckIn.tsx";

//CHECKIN
import AddCredits from "./pages/AddCredits.tsx";

// PARTIALS
import BottomNav from "./components/Partials/BottomNav.tsx";
import "./App.css";

function AppContent() {
  const location = useLocation();

  const hideNavRoutes = ["/home/crowd", "/", "/login", "/home/checkIn", "/home/AddCredits"]; // HIDE ROUTE PARAMETERS

  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Page content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Onboarding1 />} />
          <Route path="/login" element={<Login />} />

          <Route path="/progress" element={<MyProgress />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/store" element={<Store />} />

          <Route path="/home/crowd" element={<CrowdDetails />} />
          <Route path="/home/checkIn" element={<CheckIn />} />
          <Route path="/home/AddCredits" element={<AddCredits />} />
        </Routes>
      </div>

      {!shouldHideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
