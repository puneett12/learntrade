import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ModulesPage from "./pages/ModulesPage";
import ModuleDetailPage from "./pages/ModuleDetailPage";
import LessonPage from "./pages/LessonPage";
import QuizPage from "./pages/QuizPage";
import QuizResultPage from "./pages/QuizResultPage";
import ProgressPage from "./pages/ProgressPage";
import AdminPanelPage from "./pages/AdminPanelPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { useAuth } from "./context/AuthContext";
import AIStockTutor from "./components/AIStockTutor";

const App = () => {
  return (
    <Router>
      <AppShell />
    </Router>
  );
};

const AppShell = () => {
  const { user } = useAuth();
  const location = useLocation();
  const onHomeWithoutUser = location.pathname === "/" && !user;
  const onAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const hideNavbar = onHomeWithoutUser || onAuthPage;

  return (
    <div className="app-shell">
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/ai-tutor"
          element={
             <ProtectedRoute>
               <AIStockTutor />
            </ProtectedRoute>
         }
       />

        <Route
          path="/modules"
          element={
            <ProtectedRoute>
              <ModulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modules/:moduleId"
          element={
            <ProtectedRoute>
              <ModuleDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons/:lessonId/quiz"
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:quizId/result"
          element={
            <ProtectedRoute>
              <QuizResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanelPage />
            </AdminRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
