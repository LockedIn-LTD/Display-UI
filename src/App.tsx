import React, { useEffect, useState } from "react";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";

import LoginPage from "./pages/login/login";
import DriverSelection from "./pages/driver-selection/driver-selection";
import StatusProcessing from "./pages/status-processing/status-processing";
import Alerts from "./pages/alerts/alerts";
import Settings from "./pages/settings/settings"; // <-- new

import "./App.css";

type Screen = "login" | "drivers" | "processing" | "alerts" | "settings";
type Driver = { id: string; fullName: string };

function Stage({
  screen,
  go,
  selectedDriver,
  setSelectedDriver,
  onLogout,
}: {
  screen: Screen;
  go: (s: Screen) => void;
  selectedDriver: Driver | null;
  setSelectedDriver: (d: Driver | null) => void;
  onLogout: () => void;
}) {
  const { theme } = useTheme();

  // central navigation helper (also resets driver on logout->login)
  const nav = (s: Screen) => {
    if (s === "login") setSelectedDriver(null);
    go(s);
  };

  return (
    <div className={`stage theme-scope ${theme === "dark" ? "dark" : ""}`}>
      {screen === "login" && <LoginPage onSuccess={() => nav("drivers")} />}

      {screen === "drivers" && (
        <DriverSelection
          onSelect={(d) => {
            setSelectedDriver(d);
            nav("processing");
          }}
        />
      )}

      {screen === "processing" && (
        <StatusProcessing
          driverName={selectedDriver?.fullName || undefined}
          onDone={() => nav("alerts")}
        />
      )}

      {screen === "alerts" && (
        <Alerts
          go={nav}
          initialState="normal"
          simulate={true}
          onLogout={onLogout}          // <-- pass logout handler to header
        />
      )}

      {screen === "settings" && (
        <Settings
          go={nav}
          onLogout={onLogout}           // <-- same logout from settings
        />
      )}
    </div>
  );
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleLogout = () => {
    setSelectedDriver(null);
    setScreen("login");
    setToast("Logged out successfully");
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <ThemeProvider>
      <div className="viewport">
        {toast && <div className="toast">{toast}</div>}
        <Stage
          screen={screen}
          go={setScreen}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
          onLogout={handleLogout}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
