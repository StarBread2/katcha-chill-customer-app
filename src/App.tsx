import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

//ONBOARDING
import Onboarding1 from "./pages/Onboarding/Onboarding1.tsx";
import Login from "./pages/Onboarding/Login.tsx";
//MAIN
  //DASHBOARD
    import Dashboard from "./pages/Dashboard.tsx";
      //CrowdDetails
      import CrowdDetails from "./pages/CrowdDetails.tsx";
      //CHECKIN
      import CheckIn from "./pages/CheckIn.tsx";
      //ADD CREDITS
      import AddCredits from "./pages/AddCredits.tsx";
  //PROGRESS
    import MyProgress from "./pages/MyProgress.tsx";
  //STORE
    import Store from "./pages/Store.tsx";
      //CART
      import Cart from "./pages/Cart.tsx";
      //ORDERS
      import Orders from "./pages/Orders.tsx";
      import PayOrder from "./pages/PayOrder.tsx";


//SETTINGS
import Settings from "./pages/Settings.tsx";
//AVAILABLE CREDITS
import AvailableCredits from "./pages/AvailableCredits.tsx";
//PAGE NOT FOUND
import PageNotFound from "./pages/PageNotFound.tsx";

// PARTIALS
import BottomNav from "./components/Partials/BottomNav.tsx";
import "./App.css";


//ANIMATIONS
import PageTransition from "./components/Transitions/PageTransition.tsx";
//SECURITY
//PROTECTED ROUTES
import ProtectedRoute from "./auth/ProtectedRoute.tsx";
//SCROLL TO TOP
import ScrollToTop from "./components/ScrollToTop.tsx";
//NOTIFICATIONS
import { Toaster } from "sonner";


function AppContent() {
  const location = useLocation();

  const hideNavRoutes = ["/home/crowd", "/", "/login", "/home/checkIn", "/home/AddCredits", "/home/availableCredits", "*", "/store/cart", "/store/orders", "/store/orders/pay" ]; // HIDE ROUTE PARAMETERS

  const shouldHideNav = hideNavRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Page content */}
      <div className="flex-1 relative h-full overflow-hidden">

        {/* ========== LOGIN ========== */}
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Onboarding1 />
                </PageTransition>
              }
            />
            <Route
              path="/login"
              element={
                <PageTransition>
                  <Login />
                </PageTransition>
              }
            />
          {/* ========== LOGIN ========== */}


          {/* ========== MAIN ========== */}
            <Route
              path="/progress"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <MyProgress />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Dashboard />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/store"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Store />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <PageTransition>
                    <Settings />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
            path="/store/cart"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Cart />
                </PageTransition>
              </ProtectedRoute>
            }
            />
            <Route
            path="/store/orders"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Orders />
                </PageTransition>
              </ProtectedRoute>
            }
            />
            <Route
            path="/store/orders/pay"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <PayOrder />
                </PageTransition>
              </ProtectedRoute>
            }
            />
          {/* ========== MAIN ========== */}


          {/* ========== EXTRAS ========== */}
            <Route
              path="/home/crowd"
              element={
                <ProtectedRoute>
                  <PageTransition type="slide-left">
                    <CrowdDetails />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/checkIn"
              element={
                <ProtectedRoute>
                  <PageTransition type="slide-left">
                    <CheckIn />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/AddCredits"
              element={
                <ProtectedRoute>
                  <PageTransition type="slide-left">
                    <AddCredits />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/availableCredits"
              element={
                <ProtectedRoute>
                  <PageTransition type="slide-left">
                    <AvailableCredits />
                  </PageTransition>
                </ProtectedRoute>
              }
            />
          {/* ========== EXTRAS ========== */}


          <Route
            path="*"
            element={
              <PageTransition>
                <PageNotFound />
              </PageTransition>
            }
          />
        </Routes>
      </div>

      {!shouldHideNav && <BottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          className: "font-montserrat rounded-2xl shadow-md p-10",
        }}
      />
    </Router>
  );
}
