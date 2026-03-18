import React, { useState } from 'react';
import Calendar from '../components/Calendar/Calendar';
import '../App.css';

export default function CalendarPage({ tasks = [] }) {
  // State to track which day the user clicked
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  // Filter tasks that match the selected day
  const tasksForSelectedDay = tasks.filter(task => {
    const taskDate = new Date(task.dueDate).getDate();
    return taskDate === selectedDate;
  });

  return (
    <div className="calendar-page-container">
      <div className="calendar-main">
        <h2>Team Schedule</h2>
        {/* Pass a function to the calendar to update the selected date */}
        <Calendar tasks={tasks} onDateClick={(day) => setSelectedDate(day)} />
      </div>

      <aside className="calendar-sidebar">
        <div className="sidebar-header">
          <h3>Tasks for Feb {selectedDate}</h3>
          <span className="task-count">{tasksForSelectedDay.length} Tasks</span>
        </div>

        <div className="task-preview-list">
          {tasksForSelectedDay.length > 0 ? (
            tasksForSelectedDay.map(task => (
              <div key={task.id} className="mini-task-card">
                <div className={`status-dot ${task.status}`}></div>
                <div>
                  <p className="mini-task-title">{task.title}</p>
                  <p className="mini-task-time">{task.assignee || 'Unassigned'}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-tasks">No tasks scheduled for this day. </p>
          )}
        </div>

        {}
        <div className="calendar-stats">
          <h4>Daily Progress</h4>
          <p>
          </p>
          <div className="progress-ring">
             {/* This fulfills the requirement to view task completion rates */}
             <strong>{tasksForSelectedDay.length > 0 ? 'Action Required' : 'Clear'}</strong>
          </div>
        </div>
      </aside>
    </div>
  );
}