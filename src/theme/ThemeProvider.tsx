import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggleTheme: () => void; targetIcon: "moon" | "sun" };

const ThemeCtx = createContext<Ctx | null>(null);

function getInitialTheme(): Theme {
  const saved = localStorage.getItem("ds-theme");
  if (saved === "light" || saved === "dark") return saved;
  return "light"; // default to light
}

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

export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
