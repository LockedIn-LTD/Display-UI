import { useEffect, useState } from "react";
import MoonToggle from "../../components/MoonToggle";
import logoUrl from "../../assets/Drivesence-logo.png";
import driverIconUrl from "../../assets/Driver-icon.png";
import "./driver-selection.css";
import { listDrivers, type Driver } from "../../api/client";

type Props = { onSelect?: (driver: Driver) => void };

export default function DriverSelection({ onSelect }: Props) {
  const [drivers, setDrivers] = useState<Driver[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await listDrivers();
        if (!cancelled) setDrivers(data);
      } catch (err) {
        console.error("Failed to load drivers:", err);
        if (!cancelled) setDrivers([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="ds-screen">
      <div className="ds-head">
        <img src={logoUrl} alt="DriveSense" className="logo" />
        <MoonToggle />
      </div>

      <h1 className="ds-title">Who is driving ?</h1>

      <div className="ds-grid">
        {(drivers ?? []).map((d) => (
          <button
            key={d.id}
            className="driver-card"
            onClick={() => onSelect?.(d)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(d);
              }
            }}
          >
            <div className="driver-avatar">
              <img
                src={d.avatarUrl ?? driverIconUrl}
                alt={d.fullName}
                className="driver-img"
              />
            </div>
            <div className="driver-name">{d.fullName}</div>
          </button>
        ))}

        {/* Loading state */}
        {drivers === null && (
          <>
            <div className="driver-card skeleton" aria-hidden="true" />
            <div className="driver-card skeleton" aria-hidden="true" />
            <div className="driver-card skeleton" aria-hidden="true" />
            <div className="driver-card skeleton" aria-hidden="true" />
          </>
        )}

        {/* Empty state */}
        {drivers && drivers.length === 0 && (
          <>
            <div className="driver-card disabled" aria-disabled="true">
              <div className="driver-avatar">
                <img src={driverIconUrl} alt="" className="driver-img" />
              </div>
              <div className="driver-name">Unknown Driver</div>
            </div>
            <div className="driver-card disabled" aria-disabled="true">
              <div className="driver-avatar">
                <img src={driverIconUrl} alt="" className="driver-img" />
              </div>
              <div className="driver-name">Unknown Driver</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
