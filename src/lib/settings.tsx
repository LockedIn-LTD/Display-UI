import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type SettingsContextType = {
  brightness: number;
  setBrightness: (v: number) => void;
  volume: number;
  setVolume: (v: number) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

const STORAGE_KEY = "drivesense-screen-settings";

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [brightness, setBrightness] = useState<number>(100);
  const [volume, setVolume] = useState<number>(70);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.brightness === "number") {
        setBrightness(parsed.brightness);
      }
      if (typeof parsed.volume === "number") {
        setVolume(parsed.volume);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const data = { brightness, volume };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [brightness, volume]);

  return (
    <SettingsContext.Provider
      value={{ brightness, setBrightness, volume, setVolume }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }
  return ctx;
};
