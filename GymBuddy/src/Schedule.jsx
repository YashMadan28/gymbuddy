import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./styles/common.css";
import "./styles/daygrid.css";
import "./styles/timegrid.css";

function CalendarPage() {
  const [events, setEvents] = useState([
    { title: "Chest Day", date: "2025-03-27" },
    { title: "Leg Day", date: "2025-03-29" },
  ]);

  const handleDateClick = (arg) => {
    const title = prompt("Enter workout name:");
    if (title) {
      setEvents([...events, { title, date: arg.dateStr }]);
    }
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto" }}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        height="auto"
      />
    </div>
  );
}

export default CalendarPage;
