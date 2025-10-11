import { useState } from "react";
import MoonToggle from "../../components/MoonToggle";

import logoUrl from "../../assets/Drivesence-logo.png";
import backPng from "../../assets/back.png";
import phonePng from "../../assets/Phone.png";
import settingsPng from "../../assets/Settings.png";
import logoutPng from "../../assets/logout.png";

import "./settings.css";

type Screen = "login" | "drivers" | "processing" | "alerts" | "settings";

export default function Settings({
  go,
  onLogout,
}: {
  go: (s: Screen) => void;
  onLogout: () => void;
}) {
  const [volume, setVolume] = useState(65);
  const [brightness, setBrightness] = useState(70);
  const [saving, setSaving] = useState(false);

  // dynamic slider color gradient based on current value
  const sliderBg = (val: number) =>
    `linear-gradient(to right, #3d9970 0%, #3d9970 ${val}%, #a7d8c5 ${val}%, #a7d8c5 100%)`;

  // simulate save
  function onSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      go("processing"); // after saving, return to status page
    }, 500);
  }

  return (
    <div className="settings-wrap">
      {/* Header */}
      <div className="settings-head">
        <button className="icon-btn" onClick={() => go("processing")} title="Back">
          <img src={backPng} alt="Back" />
        </button>

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
          <button className="icon-btn active" title="Settings">
            <img src={settingsPng} alt="Settings" />
          </button>
          <MoonToggle />
          <button className="icon-btn" title="Logout" onClick={onLogout}>
            <img src={logoutPng} alt="Logout" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h1 className="settings-title">Manage Your System Settings</h1>

      {/* Controls */}
      <div className="settings-body">
        {/* Volume */}
        <div className="row">
          <label className="label">Speaker Volume</label>
          <div className="slider">
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(e.currentTarget.valueAsNumber)}
              onInput={(e) => setVolume((e.target as HTMLInputElement).valueAsNumber)}
              aria-label="Speaker volume"
              style={{ background: sliderBg(volume) }}
            />
          </div>
        </div>

        {/* Brightness */}
        <div className="row">
          <label className="label">Screen Brightness</label>
          <div className="slider">
            <input
              type="range"
              min={0}
              max={100}
              value={brightness}
              onChange={(e) => setBrightness(e.currentTarget.valueAsNumber)}
              onInput={(e) => setBrightness((e.target as HTMLInputElement).valueAsNumber)}
              aria-label="Screen brightness"
              style={{ background: sliderBg(brightness) }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="cta-row">
          <button className="pill cta save" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>

          <button className="pill cta logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
