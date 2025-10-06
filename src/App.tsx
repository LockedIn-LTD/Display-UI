import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";
import LoginPage from "./pages/login/login";
import DriverSelection from "./pages/driver-selection/driver-selection";
import StatusProcessing from "./pages/status-processing/status-processing";
import Alerts from "./pages/alerts/alerts";
import "./App.css";

type Screen = "login" | "drivers" | "processing" | "alerts";
type Driver = { id: string; fullName: string };

function Stage({
  screen,
  go,
  selectedDriver,
  setSelectedDriver,
}: {
  screen: Screen;
  go: (s: Screen) => void;
  selectedDriver: Driver | null;
  setSelectedDriver: (d: Driver | null) => void;
}) {
  const { theme } = useTheme();

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

      {screen === "alerts" && <Alerts go={nav} initialState="normal" simulate={true} />}
    </div>
  );
}

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>("login");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  return (
    <ThemeProvider>
      <div className="viewport">
        <Stage
          screen={screen}
          go={setScreen}
          selectedDriver={selectedDriver}
          setSelectedDriver={setSelectedDriver}
        />
      </div>
    </ThemeProvider>
  );
};

export default App;
