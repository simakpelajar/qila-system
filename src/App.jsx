import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import styles from "./style";
import { Navbar, Hero, Stats, Business, Billing, CardDeal, Testimonials, Clients, CTA, Footer } from "./components";
import AnimatedCursor from "react-animated-cursor";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications
import SignIn from "./components/views/auth/SignIn";
import SignUp from "./components/views/auth/SignUp";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/CoursePage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/CategoryPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PrivateRoute from "./components/views/auth/PrivateRoute";
import CoursePage from "./pages/CoursePage";
import CategoryPage from "./pages/CategoryPage";

const App = () => (
  <Router>
    {/* Animated Cursor */}
    <AnimatedCursor
      innerSize={8}
      outerSize={20}
      color="255, 0, 128"
      outerAlpha={0.4}
      innerScale={0.7}
      outerScale={5}
    />

    {/* Toast Container */}
    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    {/* Routes Configuration */}
    <Routes>
      {/* Authentication Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Home Route (No authentication required) */}
      <Route
        path="/"
        element={
          <>
            {/* Navbar */}
            <div className={`${styles.paddingX} ${styles.flexCenter} bg-primary w-full overflow-hidden sticky top-0 z-[9]`}>
              <div className={`${styles.boxWidth}`}>
                <Navbar />
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-primary w-full overflow-hidden">
              <div className={`bg-primary ${styles.flexStart}`}>
                <div className={`${styles.boxWidth}`}>
                  <Hero />
                </div>
              </div>

              <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
                <div className={`${styles.boxWidth}`}>
                  <Stats />
                  <Business />
                  <Billing />
                  <CardDeal />
                  <Testimonials />
                  <Clients />
                  <CTA />
                  <Footer />
                </div>
              </div>
            </div>
          </>
        }
      />

      {/* Protected Routes for Admin */}
      <Route
        path="/admin/*"
        element={
          <PrivateRoute>
            <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
              <Sidebar />
              <Routes>
                <Route path="overview" element={<OverviewPage />} />
                <Route path="course" element={<CoursePage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="category" element={<CategoryPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
              </Routes>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>

  </Router>
);

export default App;
