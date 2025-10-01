import { useEffect, useState } from "react";
import MoonToggle from "../../components/MoonToggle";
import logoUrl from "../../assets/Drivesence-logo.png";
import driverIconUrl from "../../assets/Driver-icon.png";
import "./driver-selection.css";

type Driver = { id: string; fullName: string; avatarUrl?: string };

// Props: call onSelect(driver) when a card is clicked
type Props = { onSelect?: (driver: Driver) => void };

async function getDrivers(): Promise<Driver[]> {
 
  // const res = await fetch("/api/drivers");
  // if (!res.ok) throw new Error("Failed to load drivers");
  // return (await res.json()) as Driver[];

  // Mock until API is ready
  return [
    { id: "1", fullName: "David Brown" },
    { id: "2", fullName: "Unknown Driver" },
    { id: "3", fullName: "Unknown Driver" },
    { id: "4", fullName: "Unknown Driver" },
  ];
}
// --------------------------------------------------------

export default function DriverSelection({ onSelect }: Props) {
  const [drivers, setDrivers] = useState<Driver[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getDrivers();
        if (!cancelled) setDrivers(data);
      } catch {
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

        {/* If API returns 0 rows, keep two placeholders visible */}
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