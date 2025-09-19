import { createContext, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { isAuthenticated } from '../helpers/localstorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [auth, setAuth] = useState(null);
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const location = useLocation();

  useEffect(() => {
    // Check authentication status on mount
    const user = isAuthenticated();

    if (user) {
      setIsAuth(true);
      setAuth({ user });
      if (user.role === 'admin') setIsAdminAuth(true);
    }
    setLoading(false); // Set loading to false after initial check
  }, [location]);

  const contextValues = {
    setIsAuth,
    isAuth,
    isAdminAuth,
    auth,
    loading, // Provide loading state to context
  };

  return (
    <AuthContext.Provider value={contextValues}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
