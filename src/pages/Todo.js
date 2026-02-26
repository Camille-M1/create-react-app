import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function dateVal(d) {
  return d && !isNaN(new Date(d)) ? new Date(d).getTime() : Infinity;
}

function formatICalDate(dateStr) {
  const d = new Date(dateStr);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

function escapeICal(text = '') {
  return String(text).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,');
}

function isSameDay(d1, d2) {
  if (!d1 || !d2) return false;
  const a = new Date(d1), b = new Date(d2);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isToday(d) {
  return isSameDay(d, new Date());
}

function isThisWeek(d) {
  if (!d) return false;
  const dt = new Date(d);
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0-6
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 7);
  const nd = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  return nd >= start && nd < end;
}

function isOverdue(d) {
  if (!d) return false;
  const dt = new Date(d);
  const today = new Date();
  const nd = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return nd < t;
}

export default function Todo({ tasks: initialTasks = [] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    // Update when props change
    setTasks(initialTasks);
  }, [initialTasks]);

  // Sort by nearest due date first; tasks without a date go last
  const sorted = [...tasks].sort((a, b) => dateVal(a.dueDate) - dateVal(b.dueDate));

    const filtered = sorted.filter(t => {
      const isCompleted = t.completed || t.status === 'done';

      // Completed filter: show only completed tasks
      if (filter === 'completed') return isCompleted;

      // Hide done tasks by default in the To‑Do list
      if (t.status === 'done') return false;

      // Hide completed tasks unless 'Show completed' is checked
      if (!showCompleted && isCompleted) return false;

      if (filter === 'overdue' && !isOverdue(t.dueDate)) return false;
      if (filter === 'today' && !isToday(t.dueDate)) return false;
      if (filter === 'week' && !isThisWeek(t.dueDate)) return false;
      if (filter === 'no-due' && t.dueDate) return false;

      if (priorityFilter !== 'all' && (t.priority || 'medium') !== priorityFilter) return false;

      const search = (t.title + ' ' + (t.notes || '')).toLowerCase();
      if (query && !search.includes(query.toLowerCase())) return false;

      return true;
    });

  function exportICS() {
    const items = tasks.filter(t => t.dueDate);
    if (items.length === 0) {
      alert('No tasks with due dates to export.');
      return;
    }

    let ics = 'BEGIN:VCALENDAR\r\nPRODID:-//TaskPilot//EN\r\nVERSION:2.0\r\nCALSCALE:GREGORIAN\r\nMETHOD:PUBLISH\r\n';
    const nowStamp = new Date().toISOString().replace(/[-:.]/g, '').split('Z')[0] + 'Z';

    items.forEach(task => {
      const uid = `task-${task.id}@taskpilot`;
      const dtStart = formatICalDate(task.dueDate);
      const d = new Date(task.dueDate);
      const next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      const dtEnd = formatICalDate(next.toISOString());

      ics += 'BEGIN:VEVENT\r\n';
      ics += `UID:${uid}\r\n`;
      ics += `DTSTAMP:${nowStamp}\r\n`;
      ics += `DTSTART;VALUE=DATE:${dtStart}\r\n`;
      ics += `DTEND;VALUE=DATE:${dtEnd}\r\n`;
      ics += `SUMMARY:${escapeICal(task.title)}\r\n`;
      if (task.notes) ics += `DESCRIPTION:${escapeICal(task.notes)}\r\n`;
      ics += 'END:VEVENT\r\n';
    });

    ics += 'END:VCALENDAR\r\n';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  // First, calculate the percentage at the top of your function (before the return)
  const total = tasks.length;
  const completedCount = tasks.filter(t => t.completed || t.status === 'done').length;
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const strokeDasharray = `${percentage}, 100`;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR SECTION */}
      <aside className="sidebar-widgets">
        <div className="progress-card">
          <h4>Goal Progress</h4>
          <svg viewBox="0 0 36 36" className="circular-chart">
            <path className="circle-bg"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path className="circle"
              strokeDasharray={strokeDasharray}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" className="percentage">{percentage}%</text>
          </svg>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px', textAlign: 'center' }}>
            {completedCount} of {total} tasks completed
          </p>
        </div>
        
        {/* Quick Tip Widget */}
        <div className="progress-card" style={{ marginTop: '10px' }}>
          <h4 style={{ color: 'var(--accent-dark)' }}>Pro Tip</h4>
          <p style={{ fontSize: '0.8rem', color: '#555', lineHeight: '1.4' }}>
            Keep your momentum going! Sorting by "Today" helps you focus on immediate wins.
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT SECTION */}
      <div className="todo-page">
        <h2>To‑Do</h2>

        <div className="todo-controls">
          <input 
            className="search-input" 
            placeholder="Search tasks" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
          />

          <select className="filter-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
            <option value="today">Due today</option>
            <option value="week">Due this week</option>
            <option value="no-due">No due date</option>
          </select>

          <select className="filter-select" value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
            <option value="all">All priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} /> 
            Show completed
          </label>

          <button className="btn-secondary" onClick={exportICS}>Export</button>

          <div style={{ marginLeft: 'auto' }}>
            <Link to="/todos/manage" className="btn-secondary" title="Edit, complete, or delete tasks">Manage tasks</Link>
          </div>
        </div>

        <div className="task-list">
          {filtered.length === 0 && <p className="empty">No tasks found.</p>}
          {filtered.map(task => (
            <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-main">
                <div className="task-meta">
                  <div className="task-title">
                    <Link to={`/todos/${task.id}`} className="nav-link">{task.title}</Link>
                  </div>
                  <div className={`task-due ${task.dueDate && task.dueDate < new Date().toISOString().slice(0,10) ? 'overdue' : ''}`}>
                    {task.dueDate ? task.dueDate : 'No due date'}
                  </div>
                  <div className="task-priority-container">
                    <strong>Priority:</strong> 
                    <span className={`priority-tag priority-${(task.priority || 'medium').toLowerCase()}`}>
                      {(task.priority || 'medium').toUpperCase()}
                    </span>
                  </div>
                  {task.notes && <div className="task-notes-text">{task.notes}</div>}
                </div>
              </div>
              <div className="task-actions">
                {task.dueDate && (
                  <a
                    className="btn-link"
                    target="_blank"
                    rel="noreferrer"
                    href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(task.title)}&dates=${formatICalDate(task.dueDate)}/${formatICalDate(new Date(new Date(task.dueDate).getFullYear(), new Date(task.dueDate).getMonth(), new Date(task.dueDate).getDate() + 1).toISOString())}&details=${encodeURIComponent(task.notes || '')}`}
                  >
                    Add to Google Calendar
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

