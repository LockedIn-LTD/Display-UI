import React, { useEffect, useMemo, useState } from "react";
// Import Context, Types from the new file
import { ThemeCtx, type Theme, type Ctx } from "./theme-context";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("ds-theme");
  if (saved === "light" || saved === "dark") return saved;
  return "light"; // default to light
}

// ThemeProvider is now the ONLY export (besides types/interfaces)
export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("ds-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => (t === "light" ? "dark" : "light"));

  const value = useMemo<Ctx>(() => ({
    theme,
    toggleTheme,
    targetIcon: theme === "light" ? "moon" : "sun",
  }), [theme]);

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
};
