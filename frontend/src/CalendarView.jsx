import "./calendar.css";
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarView({ prefs }) {
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    fetch("http://localhost:8000/events")
      .then((res) => res.json())
      .then((data) =>
        setEvents(
          data.map((e) => ({
            id: e.id,
            title: e.title,
            start: e.start,
            end: e.end,
          }))
        )
      )
      .catch((err) => console.error("Failed to fetch events:", err));
  };

  useEffect(() => {
    fetchEvents(); // initial load
    const interval = setInterval(fetchEvents, 5000); // refresh every 5 seconds
    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <div
      className={prefs.darkMode ? "dark-calendar" : ""}
      style={{
        padding: "20px",
        backgroundColor: prefs.darkMode ? "#1e1e1e" : "#f9f9f9",
        borderRadius: "8px",
      }}
    >
      <h2>Calendar</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        events={events}
        height="auto"
        firstDay={prefs.weekStart === "monday" ? 1 : 0}
        slotLabelFormat={{
          hour: "numeric",
          minute: "2-digit",
          hour12: prefs.timeFormat === "12h",
        }}
      />
    </div>
  );
}
