import { createContext, useContext } from "react";

// Types
export type Theme = "light" | "dark";
export type Ctx = { theme: Theme; toggleTheme: () => void; targetIcon: "moon" | "sun" };

// Context (This is now defined and exported here)
export const ThemeCtx = createContext<Ctx | null>(null);

// Custom Hook (This is now defined and exported here)
export const useTheme = () => {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
