import React, { useCallback, useEffect, useState } from "react";
import { ThemeProvider } from "./theme/ThemeProvider";
import { useTheme } from "./theme/theme-context";
import LoginPage from "./pages/login/login";
import DriverSelection from "./pages/driver-selection/driver-selection";
import StatusProcessing from "./pages/status-processing/status-processing";
import Alerts from "./pages/alerts/alerts";
import Settings from "./pages/settings/settings";

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

  const nav = useCallback(
    (s: Screen) => {
      if (s === "login") setSelectedDriver(null);
      go(s);
    },
    [go, setSelectedDriver]
  );

  const handleDriverSelect = useCallback(
    (d: Driver) => {
      setSelectedDriver(d);
      nav("processing");
    },
    [nav, setSelectedDriver]
  );

  const processingDone = useCallback(() => nav("alerts"), [nav]);

  return (
    <div className={`stage theme-scope ${theme === "dark" ? "dark" : ""}`}>
      {screen === "login" && <LoginPage onSuccess={() => nav("drivers")} />}

      {screen === "drivers" && (
        <DriverSelection onSelect={handleDriverSelect} />
      )}

      {screen === "processing" && (
        <StatusProcessing
          driverName={selectedDriver?.fullName || undefined}
          onDone={processingDone}
        />
      )}

      {screen === "alerts" && (
        <Alerts
          go={nav}
          driverId={selectedDriver?.id}
          initialState="normal"
          simulate={false}
          onLogout={onLogout}
        />
      )}

      {screen === "settings" && <Settings go={nav} onLogout={onLogout} />}
    </div>
  );
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const handleLogout = useCallback(() => {
    setSelectedDriver(null);
    setScreen("login");
    setToast("Logged out successfully");
  }, []);

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
