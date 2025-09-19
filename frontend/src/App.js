import { Navigate, Route, Routes } from 'react-router-dom';
import BaseLoading from './components/loader/config-loading'; // Optional: Loader component for loading state
import { useAuth } from './context/auth-context'; // Assuming your context has the auth state
import AuthRoutes from './routes/authRoutes'; // The authentication routes
import PublicRoutes from './routes/publicRoutes'; // The public routes

const PrivateRoute = ({ isAuth, children }) => {
  return isAuth ? children : <Navigate to="/auth" replace />;
};

const AuthRoute = ({ isAuth, children }) => {
  return !isAuth ? children : <Navigate to="/dashboard" />;
};

function App() {
  const { isAuth, loading, isAdminAuth } = useAuth(); // Accessing the auth state and loading from context

  // If still loading (e.g., checking for auth token), show a loading indicator
  if (loading) {
    return <BaseLoading loading={loading} />; // Optional: You can replace this with your custom loader component
  }

  return (
    <Routes>
      {/* Private Routes (Only accessible if authenticated) */}
      <Route
        path="/dashboard/*"
        element={
          <PrivateRoute isAuth={isAuth}>
            <PublicRoutes />
          </PrivateRoute>
        }
      />

      {/* Authentication Routes (Only accessible if not authenticated) */}
      <Route
        path="/auth/*"
        element={
          <AuthRoute isAuth={isAuth}>
            <AuthRoutes />
          </AuthRoute>
        }
      />

      {/* Fallback route for unmatched paths */}
      <Route
        path="*"
        element={<Navigate to={isAuth ? '/dashboard' : '/auth'} replace />}
      />
    </Routes>
  );
}

export default App;
