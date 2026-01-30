import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "./services/authService";
import ProjectDetail from "./pages/ProjectDetail";

function App() {
  const PrivateRoute = ({ children }) => {
    return getCurrentUser() ? children : <Navigate to="/signin" />;
  };

  return (
    <>
      <Toaster />
      <Routes>
        {/* rutas privadas */}
        <Route path="/signin" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/project/:projectId"
          element={
            <PrivateRoute>
              <ProjectDetail />
            </PrivateRoute>
          }
        />
        {/* rutas públicas */}
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </>
  );
}

export default App;
