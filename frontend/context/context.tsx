"use client";

import { createContext, useContext, useState } from "react";

// Create the context
const ThemeContext = createContext({
  isDarkMode: false,
  setIsDarkMode: (value: boolean) => {}
});

// Create the provider
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Use the context
export function useTheme() {
  return useContext(ThemeContext);
}
