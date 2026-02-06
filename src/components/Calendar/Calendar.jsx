import { useState } from "react";
import "./Calendar.css";

// Accept tasks as a prop
function Calendar({ tasks = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [completed, setCompleted] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const year = currentDate.getFullYear();
  const monthIndex = currentDate.getMonth();
  const month = currentDate.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Find tasks due in this month
  const tasksByDay = {};
  tasks.forEach(task => {
    if (task.dueDate) {
      // Parse as local date, not UTC
      const [yyyy, mm, dd] = task.dueDate.split('-');
      const dt = new Date(year, monthIndex, 1); // fallback
      if (yyyy && mm && dd) {
        // JS months are 0-based
        const localDate = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
        if (localDate.getFullYear() === year && localDate.getMonth() === monthIndex) {
          const day = localDate.getDate();
          if (!tasksByDay[day]) tasksByDay[day] = [];
          tasksByDay[day].push(task);
        }
      }
    }
  });

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
              {/* Show a dot if there are tasks due */}
              {tasksByDay[day] && tasksByDay[day].length > 0 && <span className="dot task-dot" title="Tasks due" />}
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
          {/* Show tasks due on this day */}
          {tasksByDay[selectedDay] && tasksByDay[selectedDay].length > 0 && (
            <div className="tasks-due">
              <h4>Tasks Due:</h4>
              <ul>
                {tasksByDay[selectedDay].map(task => (
                  <li key={task.id}>
                    <a href={`/todos/${task.id}`} style={{ textDecoration: 'underline', color: '#0074d9' }}>{task.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Calendar;
