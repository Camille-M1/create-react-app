import React, { useEffect, useState } from 'react';
import '../App.css';

function dateVal(d) {
  return d && !isNaN(new Date(d)) ? new Date(d).getTime() : Infinity;
}

function sortTasks(list) {
  const upcoming = list.filter(t => !t.completed).sort((a, b) => dateVal(a.dueDate) - dateVal(b.dueDate));
  const completed = list.filter(t => t.completed).sort((a, b) => dateVal(a.dueDate) - dateVal(b.dueDate));
  return [...upcoming, ...completed];
}

function normalizeTasks(list) {
  return sortTasks(list.filter(t => !t.archived));
}

export default function ManageTodo({ tasks: initialTasks = [], onTasksChange }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [notify, setNotify] = useState(false);

  // Update local state when props change
  useEffect(() => {
    // Only show non-archived tasks, keep consistent ordering
    setTasks(normalizeTasks(initialTasks));
  }, [initialTasks]);

  // Keep localStorage and parent component in sync
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    if (onTasksChange) {
      // Update parent with normalized tasks to avoid reordering flicker
      onTasksChange(normalizeTasks(tasks));
    }
  }, [tasks, onTasksChange]);

  function clearForm() {
    setTitle('');
    setDueDate('');
    setNotes('');
    setEditingId(null);
    setNotify(false);
  }

  // Removed add function

  function startEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDueDate(task.dueDate || '');
    setNotes(task.notes || '');
    setNotify(!!task.notifyOnComment);
  }

  function saveEdit(e) {
    e.preventDefault();
    setTasks(prev => sortTasks(prev.map(t => t.id === editingId ? { ...t, title: title.trim(), dueDate: dueDate || null, notes: notes.trim(), notifyOnComment: !!notify } : t)));
    clearForm();
  }

  function cancelEdit() {
    clearForm();
  }

  function toggleComplete(id) {
    setTasks(prev => sortTasks(prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function onDelete(id) {
    if (window.confirm('Delete this task?')) {
      const next = tasks.filter(t => t.id !== id);
      setTasks(next);
      localStorage.setItem('tasks', JSON.stringify(next));
      if (onTasksChange) onTasksChange(next);
    }
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.completed));
  }

  return (
    <div className="todo-page manage-page">
      <h2>Manage To‑Do</h2>

      {editingId && (
        <form className="task-form" onSubmit={saveEdit}>
          <input
            className="task-input"
            placeholder="Task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <input
            type="date"
            className="task-date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
          <textarea
            className="task-notes"
            placeholder="Notes (optional)"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} /> Notify
          </label>
          <div className="task-form-actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
          </div>
        </form>
      )}

      <div className="task-list">
        {tasks.length === 0 && <p className="empty">No tasks to manage.</p>}
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-main">
              <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />
              <div className="task-meta">
                <div className="task-title">{task.title}</div>
                <div className={`task-due ${task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</div>
                {task.notes && <div className="task-notes-text">{task.notes}</div>}
              </div>
            </div>
            <div className="task-actions">
              <button className="btn-link" onClick={() => startEdit(task)}>Edit</button>
              <button className="btn-link danger" onClick={() => onDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    <div className="footer-actions" style={{ marginTop: 12 }}>
      <button className="btn-secondary" onClick={clearCompleted}>Clear selected</button>
    </div>
  </div>
  );
}
