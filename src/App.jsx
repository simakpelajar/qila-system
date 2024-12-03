import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from 'react';
import AnimatedCursor from "react-animated-cursor";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./components/common/Sidebar";
import Home from "./pages/Home";
import OverviewPage from "./pages/OverviewPage";
import SignInPage from "./pages/auth/SignIn";
import SignUpPage from "./pages/auth/SignUp";
import PrivateRoute from "./pages/auth/PrivateRoute";
import CoursePage from "./pages/CoursePage";
import CategoryPage from "./pages/CategoryPage";
import DetailCoursePage from "./pages/DetailCoursePage";
import UsersPage from "./pages/UsersPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import "./global.css";
import SidebarUser from "./components/common/SidebarUser";
import CourseUserPage from './pages/user/CourseUserPage';
import RaportUserPage from "./pages/user/RaportUserPage";
import OverviewUserPage from "./pages/user/OverviewUserPage";
import QuizPage from './pages/user/QuizPage';
import DetailRaportPage from "./pages/DetailRaportPage";
import ManageStudentsPage from "./pages/ManageStudentsPage"


const App = () => (
  <Router>
    <AnimatedCursor
      innerSize={8}
      outerSize={20}
      innerScale={0.7}
      outerScale={5}
    />

    <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />

    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} /> 

      {/* Protected Admin Routes */}
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
                <Route  path="orders" element={<OrdersPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="course/:id/detail" element={<DetailCoursePage />} />
                <Route path="course/:id/students"element={<ManageStudentsPage />}/>
                <Route path="course/:courseId/raport" element={<DetailRaportPage />} />
              </Routes>
            </div>
          </PrivateRoute>
        }
      />
       {/* Protected User Routes */}
       <Route
        path="/user/*"
        element={
          <PrivateRoute>
            <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
              <SidebarUser />
              <div className="flex-1 overflow-auto">
                <Routes>
                  <Route path="overview-user" element={<OverviewUserPage />} />
                  <Route path="course-user" element={<CourseUserPage />} />
                  <Route path="raport-user" element={<RaportUserPage />} />
          
                  <Route path="quiz/:slug" element={<QuizPage />} /> {/* Updated to use slug */}
                </Routes>
              </div>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  </Router>
);

export default App;