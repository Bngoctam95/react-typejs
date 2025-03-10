import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/theme.context';

export interface ThemeContextType {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
}

export const useThemeState = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            return savedTheme ? savedTheme === 'dark' : false;
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        }
    }, [isDarkMode]);

    return { isDarkMode, setIsDarkMode };
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}; 