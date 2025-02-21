import React, { useState } from "react";
import "./App.css";
import criticalIcon from "/assets/critical.png";
import drowsyIcon from "/assets/drowsy.png";
import normalIcon from "/assets/normal.png";
import userIcon from "/assets/user-icon.png";
import notificationIcon from "/assets/notification-icon.png";

function App() {
  const [status, setStatus] = useState("critical"); // Possible values: normal, drowsy, critical
  const [calling, setCalling] = useState(false);

  // Handle emergency call effect
  const handleEmergencyCall = () => {
    setCalling(true);
    setTimeout(() => {
      setCalling(false);
    }, 3000);
  };

  return (
    <div className="container">
      {/* Status Header */}
      <div className={`status-bar ${status}`}>
        <span className="status-text">Driver Status:</span>
        <span className={`status-${status}`}>
          {status === "critical"
            ? "CRITICAL"
            : status === "drowsy"
            ? "DROWSY"
            : "NORMAL"}
        </span>
        
        {/* Notification and User Icons */}
        <div className="icons">
          <img src={notificationIcon} alt="Notification" className="icon" />
          <img src={userIcon} alt="User" className="icon" />
        </div>
      </div>

      {/* Alert Box */}
      <div className="alert-box">
        <img
          src={
            status === "critical"
              ? criticalIcon
              : status === "drowsy"
              ? drowsyIcon
              : normalIcon
          }
          alt="Alert"
          className="alert-icon"
        />
        <div className="alert-text">
          {status === "critical" ? (
            <>
              <span>PULL OVER</span>
              <span>IMMEDIATELY</span>
            </>
          ) : status === "drowsy" ? (
            <>
              <span>REST SOON</span>
              <span>STAY ALERT</span>
            </>
          ) : (
            <>
              <span>You are</span>
              <span>Driving Safely</span>
            </>
          )}
        </div>
      </div>

      {/* Emergency Button (Only in Critical Status) */}
      {status === "critical" && (
        <button className="emergency-button" onClick={handleEmergencyCall}>
          🚨 Contact Emergency
        </button>
      )}

      {/* Fake Calling Effect */}
      {calling && <div className="calling-effect">📞 Calling Emergency...</div>}

      {/* Status Change Buttons (For UI Testing) */}
      <div className="status-buttons">
        <button className="normal-btn" onClick={() => setStatus("normal")}>
          Normal
        </button>
        <button className="drowsy-btn" onClick={() => setStatus("drowsy")}>
          Drowsy
        </button>
        <button className="critical-btn" onClick={() => setStatus("critical")}>
          Critical
        </button>
      </div>
    </div>
  );
}

export default App;
