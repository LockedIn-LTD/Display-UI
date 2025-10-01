import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";
import LoginPage from "./pages/login/login";
import DriverSelection from "./pages/driver-selection/driver-selection";
import StatusProcessing from "./pages/status-processing/status-processing";
import "./App.css";

type Screen = "login" | "drivers" | "processing"; 
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
  setSelectedDriver: (d: Driver) => void;
}) {
  const { theme } = useTheme();

  return (
    <div className={`stage theme-scope ${theme === "dark" ? "dark" : ""}`}>
      {screen === "login" && <LoginPage onSuccess={() => go("drivers")} />}

      {screen === "drivers" && (
        <DriverSelection
          onSelect={(d) => {
            setSelectedDriver(d);  
            go("processing");
          }}
        />
      )}

      {screen === "processing" && (
        <StatusProcessing
          driverName={selectedDriver?.fullName || undefined}
          onDone={() => {
            // TODO: move to next stage once sensors are ready
            // go("next");
          }}
        />
      )}
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