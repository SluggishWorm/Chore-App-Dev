import React, { useState } from "react";

export default function LaunchPage({ onStart }) {
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("24h");
  const [weekStart, setWeekStart] = useState("monday");
  const [darkMode, setDarkMode] = useState(false);

  const handleStart = () => {
    const prefs = { dateFormat, timeFormat, weekStart, darkMode };
    localStorage.setItem("userPrefs", JSON.stringify(prefs));
    onStart(prefs);
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to Chore & Calendar Tracker</h1>

      <div style={{ margin: "20px 0" }}>
        <label>Date format: </label>
        <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
        </select>
      </div>

      <div style={{ margin: "20px 0" }}>
        <label>Time format: </label>
        <select value={timeFormat} onChange={(e) => setTimeFormat(e.target.value)}>
          <option value="24h">24 Hour</option>
          <option value="12h">12 Hour (AM/PM)</option>
        </select>
      </div>

      <div style={{ margin: "20px 0" }}>
        <label>Week starts on: </label>
        <select value={weekStart} onChange={(e) => setWeekStart(e.target.value)}>
          <option value="monday">Monday</option>
          <option value="sunday">Sunday</option>
        </select>
      </div>

      <div style={{ margin: "20px 0" }}>
        <label>Dark mode: </label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
        />
      </div>

      <button
        onClick={handleStart}
        style={{
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Enter App
      </button>
    </div>
  );
}
