import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeObject, ThemeContextInterface } from "../utils/Interfaces";

import { themes, ProvisionTheme } from "../utils/Themes";

const ThemeContext = createContext<ThemeContextInterface | undefined>(
  undefined
);

const ThemeProvider = ({ children }: any) => {
  const [themeName, setThemeName] = useState("dark");
  const [theme, setTheme] = useState<ThemeObject>(themes.dark);

  useEffect(() => {
    const currentTheme = themes[themeName];
    ProvisionTheme(setTheme, currentTheme);
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

export { ThemeProvider, useTheme };
