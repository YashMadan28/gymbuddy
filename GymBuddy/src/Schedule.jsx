import React, { useState } from "react";
// FullCalendar and its plugins
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// FullCalendar styles
import "./styles/common.css";
import "./styles/daygrid.css";
import "./styles/timegrid.css";

function CalendarPage() {
  // Initial state: pre-filled events in the calendar
  const [events, setEvents] = useState([
    { title: "Chest Day", date: "2025-03-27" },
    { title: "Leg Day", date: "2025-03-29" },
  ]);

  // Handles when a user clicks on a date
  const handleDateClick = (arg) => {
    const title = prompt("Enter workout name:");
    if (title) {
      // Add the new event to the calendar state
      setEvents([...events, { title, date: arg.dateStr }]);
    }
  };

  return (
    // Container for the calendar layout
    <div style={{ maxWidth: "900px", margin: "auto", paddingTop: '65px' }}>
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

