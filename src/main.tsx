import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrightnessProvider, useBrightness } from "./lib/brightness";

const BrightnessShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { brightness } = useBrightness();

  const value = Math.max(0, Math.min(brightness, 100));
  const overlayOpacity = ((100 - value) / 100) * 0.7;

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>{children}</div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
          transition: "background-color 0.25s ease-out",
        }}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrightnessProvider>
      <BrightnessShell>
        <App />
      </BrightnessShell>
    </BrightnessProvider>
  </React.StrictMode>
);
