import React, { useRef, useState } from "react";
import MoonToggle from "../../components/MoonToggle";

import logoUrl from "../../assets/Drivesence-logo.png";
import backPng from "../../assets/back.png";
import phonePng from "../../assets/Phone.png";
import settingsPng from "../../assets/Settings.png";
import logoutPng from "../../assets/logout.png";
import alarmSound from "../../assets/alarmSound.wav";

import "./settings.css";
import { useSettings } from "../../lib/settings";

type Screen = "login" | "drivers" | "processing" | "alerts" | "settings";

export default function Settings({
  go,
  onLogout,
}: {
  go: (s: Screen) => void;
  onLogout: () => void;
}) {
  const { brightness, setBrightness, volume, setVolume } = useSettings();
  const [saving, setSaving] = useState(false);
  const previewRef = useRef<HTMLAudioElement | null>(null);

  function onSave() {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      go("processing");
    }, 500);
  }

  return (
    <div className="settings-wrap">
      <div className="settings-head">
        <button className="icon-btn" onClick={() => go("processing")} title="Back">
          <img src={backPng} alt="Back" />
        </button>

        <img
          src={logoUrl}
          alt="DriveSense"
          className="logo"
          onClick={() => go("processing")}
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

      <h1 className="settings-title">Manage Your System Settings</h1>

      <div className="settings-body">
        <div className="row">
          <label className="label">Speaker Volume</label>
          <div className="slider">
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => {
                const v = e.currentTarget.valueAsNumber;
                setVolume(v);
                if (previewRef.current) {
                  const vol = Math.max(0, Math.min(1, v / 100));
                  previewRef.current.volume = vol;
                  previewRef.current.currentTime = 0;
                  previewRef.current.play().catch(() => {});
                }
              }}
              aria-label="Speaker volume"
              style={{ ["--progress" as any]: `${volume}%` }}
            />
          </div>
        </div>

        <div className="row">
          <label className="label">Screen Brightness</label>
          <div className="slider">
            <input
              type="range"
              min={0}
              max={100}
              value={brightness}
              onChange={(e) => setBrightness(e.currentTarget.valueAsNumber)}
              aria-label="Screen brightness"
              style={{ ["--progress" as any]: `${brightness}%` }}
            />
          </div>
        </div>

        <div className="cta-row">
          <button className="pill cta save" onClick={onSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>

          <button className="pill cta logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <audio ref={previewRef} src={alarmSound} />
    </div>
  );
}
