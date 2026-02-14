import React from 'react';
import Calendar from '../components/Calendar/Calendar';
import '../App.css';

export default function CalendarPage({ tasks = [] }) {
  return (
    <div className="todo-page">
      <h2>Calendar</h2>
      <Calendar tasks={tasks} />
    </div>
  );
}
