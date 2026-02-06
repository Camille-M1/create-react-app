import { useState } from "react";
import "./Calendar.css";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [completed, setCompleted] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const month = currentDate.toLocaleString("default", { month: "long" });

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, monthIndex - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, monthIndex + 1, 1));
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setNoteInput(notes[day] || "");
  };

  const toggleComplete = (day) => {
    setCompleted({ ...completed, [day]: !completed[day] });
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progress = Math.round((completedCount / daysInMonth) * 100);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={goToPreviousMonth}>◀</button>
        <h2>{month} {year}</h2>
        <button onClick={goToNextMonth}>▶</button>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }} />
      </div>
      <p className="progress-text">{progress}% completed</p>

      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          return (
            <div
              key={day}
              className={`day ${completed[day] ? "done" : ""}`}
              onClick={() => handleDayClick(day)}
              onDoubleClick={() => toggleComplete(day)}
            >
              {day}
              {notes[day] && <span className="dot" />}
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <div className="note-panel">
          <h3>Notes for {month} {selectedDay}</h3>
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Add a deadline or note..."
          />
          <button
            onClick={() => {
              setNotes({ ...notes, [selectedDay]: noteInput });
              setSelectedDay(null);
            }}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}

export default Calendar;
