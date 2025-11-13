import React, { useEffect, useMemo, useRef, useState } from "react";
import MoonToggle from "../../components/MoonToggle";

import logoUrl from "../../assets/Drivesence-logo.png";
import iconNormal from "../../assets/Normal.png";
import iconDrowsy from "../../assets/Alert.png";
import iconCritical from "../../assets/Critical.png";
import phonePng from "../../assets/Phone.png";
import settingsPng from "../../assets/Settings.png";
import logoutPng from "../../assets/logout.png";

import "./alerts.css";
import { listEvents, type Event } from "../../api/client";

export type DriverState = "normal" | "drowsy" | "critical";
type Screen = "login" | "drivers" | "processing" | "alerts" | "settings";

interface Props {
  go: (s: Screen) => void;
  driverId?: string;            // <-- NEW: which driver's status to show
  initialState?: DriverState;   // fallback if no data yet
  simulate?: boolean;           // optional demo mode
  onLogout?: () => void;
  pollMs?: number;              // polling frequency
}

export default function Alerts({
  go,
  driverId,
  initialState = "normal",
  simulate = false,
  onLogout,
  pollMs = 4000,
}: Props) {
  const [state, setState] = useState<DriverState>(initialState);
  const [callingPhase, setCallingPhase] = useState<"idle" | "calling" | "connected">("idle");
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  // --- DEMO cycle if simulate === true (kept for dev/testing) ---
  useEffect(() => {
    if (!simulate) return;
    const seq: DriverState[] = ["normal", "drowsy", "critical"];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % seq.length;
      setState(seq[i]);
    }, 6000);
    return () => clearInterval(t);
  }, [simulate]);

  // --- Real data: poll the newest event for the driver and map to UI state ---
  useEffect(() => {
    mounted.current = true;
    if (!driverId || simulate) return; // no polling if simulating

    async function load() {
      try {
        const events = await listEvents({ driverId, limit: 1 });
        const e = events[0] ?? null;
        const next = eventToState(e, initialState);
        if (mounted.current) {
          setState(next);
          setError(null);
        }
      } catch (err: any) {
        if (mounted.current) setError(err?.message || "Failed to load status");
      }
    }

    load();
    const t = setInterval(load, pollMs);
    return () => {
      mounted.current = false;
      clearInterval(t);
    };
  }, [driverId, simulate, pollMs, initialState]);

  // action button behavior
  const startEmergencyCall = () => {
    setState("critical");
    setCallingPhase("calling");
    setTimeout(() => setCallingPhase("connected"), 2300);
    setTimeout(() => setCallingPhase("idle"), 4500);
  };

  // map state -> visuals
  const ui = useMemo(() => {
    const map = {
      normal: {
        borderClass: "border-normal",
        icon: iconNormal,
        title: "YOU ARE DRIVING SAFELY",
        showCTA: false,
      },
      drowsy: {
        borderClass: "border-drowsy",
        icon: iconDrowsy,
        title: "REST SOON, STAY ALERT",
        showCTA: false,
      },
      critical: {
        borderClass: "border-critical",
        icon: iconCritical,
        title: "PULL OVER IMMEDIATELY",
        showCTA: true,
      },
    } as const;
    return map[state];
  }, [state]);

  return (
    <div className="alerts-wrap">
      <div className="alerts-head">
        <img
          src={logoUrl}
          alt="DriveSense"
          className="logo"
          onClick={() => go("login")}
          style={{ cursor: "pointer" }}
        />

        <div className="head-right">
          <span className="help-text">Need Help ? Call Your Emergency Contact Now</span>
          <button className="icon-btn" title="Call" onClick={startEmergencyCall}>
            <img src={phonePng} alt="Call" />
          </button>

          <button className="icon-btn" title="Settings" onClick={() => go("settings")}>
            <img src={settingsPng} alt="Settings" />
          </button>

          <MoonToggle />

          {onLogout && (
            <button className="icon-btn" title="Logout" onClick={onLogout}>
              <img src={logoutPng} alt="Logout" />
            </button>
          )}
        </div>
      </div>

      <div className={`alert-card ${ui.borderClass}`}>
        <img className="state-icon" src={ui.icon} alt={state} />
        <div className="alert-title">CAUTION</div>
        <div className="alert-message">{ui.title}</div>

        {ui.showCTA && (
          <button className="alert-cta" onClick={startEmergencyCall}>
            {callingPhase === "idle" && "CALL EMERGENCY"}
            {callingPhase === "calling" && "📞 Calling Emergency..."}
            {callingPhase === "connected" && "CONNECTED"}
          </button>
        )}

        {error && <div className="alert-error">{error}</div>}
      </div>
    </div>
  );
}

/** Map the latest Event to a simple traffic-light state */
function eventToState(e: Event | null, fallback: DriverState): DriverState {
  if (!e) return fallback;

  const s = (e.status || "").toLowerCase();
  const hr = e.heartRate ?? 0;
  const spo2 = e.bloodOxygenLevel ?? 100;

  const isCritical = s.includes("high") || s.includes("critical") || spo2 < 90 || hr > 110;
  if (isCritical) return "critical";

  const isDrowsy = s.includes("mild") || s.includes("warning") || spo2 < 93 || hr > 95;
  if (isDrowsy) return "drowsy";

  return "normal";
}
