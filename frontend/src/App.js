import React, { useState, useEffect } from "react";
import CalendarView from "./CalendarView";
import ChoreList from "./ChoreList";
import LaunchPage from "./LaunchPage";

function App() {
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("userPrefs");
    if (saved) setPrefs(JSON.parse(saved));
  }, []);

  if (!prefs) {
    return <LaunchPage onStart={setPrefs} />;
  }

  return (
    <div
      style={{
        backgroundColor: prefs.darkMode ? "#121212" : "#ffffff",
        color: prefs.darkMode ? "#ffffff" : "#000000",
        minHeight: "100vh",
        padding: "10px",
      }}
    >
      <button
        onClick={() => {
          const updated = { ...prefs, darkMode: !prefs.darkMode };
          setPrefs(updated);
          localStorage.setItem("userPrefs", JSON.stringify(updated));
        }}
        style={{
          padding: "8px 12px",
          marginBottom: "20px",
          background: prefs.darkMode ? "#444" : "#ddd",
          color: prefs.darkMode ? "#fff" : "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Toggle {prefs.darkMode ? "Light" : "Dark"} Mode
      </button>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 2 }}>
          <CalendarView prefs={prefs} />
        </div>
        <div style={{ flex: 1 }}>
          <ChoreList />
        </div>
      </div>
    </div>
  );
}

export default App;
