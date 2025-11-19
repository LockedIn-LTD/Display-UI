import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type BrightnessContextType = {
  brightness: number;
  setBrightness: (v: number) => void;
};

const BrightnessContext = createContext<BrightnessContextType | undefined>(
  undefined
);

const STORAGE_KEY = "drivesense-screen-brightness";

export const BrightnessProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [brightness, setBrightness] = useState<number>(100); // no filter

  useEffect(() => {
    try {
      const raw: string | null = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed.brightness === "number") {
        setBrightness(parsed.brightness);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    const data = { brightness };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [brightness]);

  return (
    <BrightnessContext.Provider value={{ brightness, setBrightness }}>
      {children}
    </BrightnessContext.Provider>
  );
};

export const useBrightness = () => {
  const ctx = useContext(BrightnessContext);
  if (!ctx) {
    throw new Error("useBrightness must be used inside BrightnessProvider");
  }
  return ctx;
};