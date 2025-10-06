import React, { useEffect, useState } from "react";
import MoonToggle from "../../components/MoonToggle";

import logoUrl from "../../assets/Drivesence-logo.png";
import iconNormal from "../../assets/Normal.png";
import iconDrowsy from "../../assets/Alert.png";      
import iconCritical from "../../assets/Critical.png";  
import phonePng from "../../assets/Phone.png";
import settingsPng from "../../assets/Settings.png";

import "./alerts.css";

export type DriverState = "normal" | "drowsy" | "critical";
type Screen = "login" | "drivers" | "processing" | "alerts";

interface Props {
  go: (s: Screen) => void;
  initialState?: DriverState;
  simulate?: boolean;
}

export default function Alerts({
  go,
  initialState = "normal",
  simulate = true,
}: Props) {
  const [state, setState] = useState<DriverState>(initialState);

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
          <button className="icon-btn" title="Call">
            <img src={phonePng} alt="Call" />
          </button>
          <button className="icon-btn" title="Settings">
            <img src={settingsPng} alt="Settings" />
          </button>
          <MoonToggle />
        </div>
      </div>

      <div className={`alert-card ${ui.borderClass}`}>
        <img className="state-icon" src={ui.icon} alt={state} />
        <div className="alert-title">CAUTION</div>
        <div className="alert-message">{ui.title}</div>

        {ui.showCTA && (
          <button
            className="alert-cta"
            onClick={() => window.alert("Calling emergency contact…")}
          >
            CALL EMERGENCY
          </button>
        )}
      </div>
    </div>
  );
}
