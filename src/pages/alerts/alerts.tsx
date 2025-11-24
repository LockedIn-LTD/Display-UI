import React, { useEffect, useMemo, useRef, useState } from "react";
import MoonToggle from "../../components/MoonToggle";

import logoUrl from "../../assets/Drivesence-logo.png";
import iconNormal from "../../assets/Normal.png";
import iconDrowsy from "../../assets/Alert.png";
import iconCritical from "../../assets/Critical.png";
import phonePng from "../../assets/Phone.png";
import settingsPng from "../../assets/Settings.png";
import logoutPng from "../../assets/logout.png";
import alarmSound from "../../assets/alarmSound.wav";

import "./alerts.css";
import { listEvents, type Event } from "../../api/client";
import { useSettings } from "../../lib/settings";

export type DriverState = "normal" | "drowsy" | "critical";
type Screen = "login" | "drivers" | "processing" | "alerts" | "settings";
type CallingPhase = "idle" | "calling" | "connected" | "error";

interface Props {
  go: (s: Screen) => void;
  driverId?: string;
  initialState?: DriverState;
  simulate?: boolean;
  onLogout?: () => void;
  pollMs?: number;
  emergencyContact?: string;
}

export default function Alerts({
  go,
  driverId,
  initialState = "normal",
  simulate = false,
  onLogout,
  pollMs = 4000,
  emergencyContact = "+14384580018",
}: Props) {
  const [state, setState] = useState<DriverState>(initialState);
  const [callingPhase, setCallingPhase] = useState<CallingPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(true);

  const { volume } = useSettings();
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (alarmRef.current) alarmRef.current.pause();
    };
  }, []);

  // -------------------------
  // FIXED CALLING FUNCTION
  // -------------------------
  const startEmergencyCall = async () => {
    if (!emergencyContact) {
      setError("No emergency contact set. Please add one in settings.");
      setCallingPhase("error");
      return;
    }

    setError(null);
    setCallingPhase("calling");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "";

      const response = await fetch(`${baseUrl}/api/send-alert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: emergencyContact }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to trigger alert");
      }

      setCallingPhase("connected");
      timeoutRef.current = setTimeout(() => {
        setCallingPhase("idle");
      }, 4500);

    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to trigger emergency call";

      console.error("Emergency call error:", err);
      setError(errorMessage);
      setCallingPhase("error");

      timeoutRef.current = setTimeout(() => {
        setCallingPhase("idle");
        setError(null);
      }, 5000);
    }
  };

  // Simulation mode
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

  // Polling driver events
  useEffect(() => {
    mounted.current = true;
    if (!driverId || simulate) return;

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

  // Alarm sound logic
  useEffect(() => {
    if (!alarmRef.current) {
      alarmRef.current = new Audio(alarmSound);
      alarmRef.current.loop = true;
    }
    const audio = alarmRef.current;

    audio.volume = Math.max(0, Math.min(1, volume / 100));

    if (state === "critical") {
      audio.play().catch((err) => console.error("Alarm play error:", err));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [state, volume]);

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
          <span className="help-text">
            Need Help ? Call Your Emergency Contact Now
          </span>

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

      {error && (
        <div className="error-banner" style={{
          background: "#ff4444",
          color: "white",
          padding: "12px",
          marginBottom: "16px",
          borderRadius: "4px",
          textAlign: "center",
        }}>
          {error}
        </div>
      )}

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

function eventToState(e: Event | null, fallback: DriverState): DriverState {
  if (!e) return fallback;

  const s = (e.status || "").toLowerCase();
  const hr = e.heartRate ?? 0;
  const spo2 = e.bloodOxygenLevel ?? 100;

  const isCritical =
    s.includes("high") ||
    s.includes("critical") ||
    s.includes("severe") ||
    spo2 < 90 ||
    hr > 110;

  if (isCritical) return "critical";

  const isDrowsy =
    s.includes("mild") ||
    s.includes("warning") ||
    s.includes("drowsy") ||
    spo2 < 93 ||
    hr > 95;

  if (isDrowsy) return "drowsy";

  return "normal";
}
