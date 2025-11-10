import { useEffect, useState, useRef } from "react";
import MoonToggle from "../../components/MoonToggle";

import logoUrl from "../../assets/Drivesence-logo.png";
import iconNormal from "../../assets/Normal.png";
import iconDrowsy from "../../assets/Alert.png";
import iconCritical from "../../assets/Critical.png";
import phonePng from "../../assets/Phone.png";
import settingsPng from "../../assets/Settings.png";
import logoutPng from "../../assets/logout.png";

import "./alerts.css";

export type DriverState = "normal" | "drowsy" | "critical";
type Screen = "login" | "drivers" | "processing" | "alerts" | "settings";
type CallingPhase = "idle" | "calling" | "connected" | "error";

interface Props {
  go: (s: Screen) => void;
  initialState?: DriverState;
  simulate?: boolean;
  onLogout?: () => void;
  emergencyContact?: string;
}

export default function Alerts({
  go,
  initialState = "normal",
  simulate = true,
  onLogout,
  emergencyContact = "+15551234567",
}: Props) {
  const [state, setState] = useState<DriverState>(initialState);
  const [callingPhase, setCallingPhase] = useState<CallingPhase>("idle");
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startEmergencyCall = async () => {
    if (!emergencyContact) {
      setError("No emergency contact set. Please add one in settings.");
      setCallingPhase("error");
      return;
    }

    setError(null);
    setCallingPhase("calling");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      const response = await fetch("/api/send-alert", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ phone : emergencyContact })
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
      const errorMessage = err instanceof Error
        ? err.message
        : "Failed to trigger emergency call";

      console.error("Emergency call error:", err);
      setError(errorMessage);
      setCallingPhase("error");
      
      // Reset error state after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setCallingPhase("idle");
        setError(null);
      }, 5000);
    }
  };

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

  const ui = map[state];

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

          <button
            className="icon-btn"
            title="Settings"
            onClick={() => go("settings")}
          >
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
          textAlign: "center"
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
      </div>
    </div>
  );
}
