import React, { createContext, useContext } from 'react';

const ThemeContext = createContext({ mode: 'dark', toggleTheme: () => {} });

export const ThemeProviderCustom = ({ mode, toggleTheme, children }) => (
  <ThemeContext.Provider value={{ mode, toggleTheme }}>
    {children}
  </ThemeContext.Provider>
);

export const useThemeContext = () => useContext(ThemeContext);
