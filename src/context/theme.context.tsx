import { createContext, ReactNode } from 'react';
import { theme, ConfigProvider } from 'antd';
import { ThemeContextType, useThemeState } from '@/hooks/useTheme';

export const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { isDarkMode, setIsDarkMode } = useThemeState();
    const { defaultAlgorithm, darkAlgorithm } = theme;

    return (
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
            <ConfigProvider
                theme={{
                    algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
                    token: {
                        colorPrimary: isDarkMode ? '#722ed1' : '#1890ff',
                    },
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};