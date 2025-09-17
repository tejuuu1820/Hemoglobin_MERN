import { createContext, useContext, useState } from "react";


export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const toggleDarkMode = () => setIsDarkMode(!isDarkMode);


    const contextValues = {
        isDarkMode,
        setIsDarkMode,
        toggleDarkMode
    }

    return (
        <ThemeContext.Provider value={contextValues}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    return context;
}