import React, { useState } from "react";
import "./App.css";
import criticalIcon from "/assets/critical.png";
import userIcon from "/assets/user-icon.png";
import notificationIcon from "/assets/notification-icon.png";

function App() {
  const [status, setStatus] = useState("critical"); // Set only to "critical"
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
        <span className="status-critical">CRITICAL</span>
        
        {/* Notification and User Icons */}
        <div className="icons">
          <img src={notificationIcon} alt="Notification" className="icon" />
          <img src={userIcon} alt="User" className="icon" />
        </div>
      </div>

      {/* Alert Box */}
      <div className="alert-box">
        <img src={criticalIcon} alt="Alert" className="alert-icon" />
        <div className="alert-text">
          <span>PULL OVER</span>
          <br />
          <span>IMMEDIATELY</span>
        </div>
      </div>

      {/* Emergency Button */}
      <button className="emergency-button" onClick={handleEmergencyCall}>
        🚨 Contact Emergency
      </button>

      {/* Fake Calling Effect */}
      {calling && <div className="calling-effect">📞 Calling Emergency...</div>}
    </div>
  );
}

export default App;
