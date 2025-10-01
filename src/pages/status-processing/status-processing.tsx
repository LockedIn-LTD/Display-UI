import { useEffect } from "react";
import MoonToggle from "../../components/MoonToggle";
import logoUrl from "../../assets/Drivesence-logo.png";
import "./status-processing.css";


type Props = {
  driverName?: string;
  onDone?: () => void;
};

export default function StatusProcessing({ driverName, onDone }: Props) {
  useEffect(() => {
    // --- SENSOR POLLING PLACEHOLDER ---
    // in the future with API:
    // const timer = setInterval(async () => {
    //   const res = await fetch("/api/sensors/status");
    //   const ok = await res.json(); // your shape here
    //   if (ok.ready) { clearInterval(timer); onDone?.(); }
    // }, 1000);

    // TEMP: auto-finish in 4s (removing this when API is ready)
    const t = setTimeout(() => onDone?.(), 4000);
    return () => { clearTimeout(t);};
  }, [onDone]);

  return (
    <div className="status-wrap">
      <div className="status-head">
        <img src={logoUrl} alt="DriveSense" className="logo" />
        <MoonToggle />
      </div>

      <div className="status-body">
        <div className="status-row">
          <div className="spinner" aria-hidden="true" />
          <div className="title">Initializing DriveSense...</div>
        </div>

        <p className="hint">
          Please place your hands on the wheel and
          <br />
          look forward while we check your status{driverName ? `, ${driverName}` : ""}...
        </p>
      </div>
    </div>
  );
}