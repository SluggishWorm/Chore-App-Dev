import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function CalendarView({ prefs }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
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
      );
  }, []);

  return (
    <div
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
