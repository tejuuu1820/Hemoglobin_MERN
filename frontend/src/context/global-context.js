import { createContext, useContext } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    const contextValues = {

    };

    return (
        <GlobalContext.Provider value={contextValues}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    return context;
};
