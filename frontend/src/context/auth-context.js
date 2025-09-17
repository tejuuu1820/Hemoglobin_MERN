import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);


    const contextValues = {
        setIsAuth,
        isAuth,
        auth,
        loading,
        setAuth
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
