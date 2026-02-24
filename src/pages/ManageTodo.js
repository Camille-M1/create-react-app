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
  const hasExternalState = typeof onTasksChange === 'function';
  const [localTasks, setLocalTasks] = useState(() => normalizeTasks(initialTasks));
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);
  const [notify, setNotify] = useState(false);
  const tasks = hasExternalState ? normalizeTasks(initialTasks) : localTasks;

  // Keep fallback local state in sync when parent state is not provided
  useEffect(() => {
    if (!hasExternalState) {
      setLocalTasks(normalizeTasks(initialTasks));
    }
  }, [initialTasks, hasExternalState]);

  function commitTasks(nextTasks) {
    const normalized = normalizeTasks(nextTasks);
    localStorage.setItem('tasks', JSON.stringify(normalized));
    if (hasExternalState) {
      onTasksChange(normalized);
      return;
    }
    setLocalTasks(normalized);
  }

  function clearForm() {
    setTitle('');
    setDueDate('');
    setNotes('');
    setPriority('medium');
    setEditingId(null);
    setNotify(false);
  }

  // Removed add function

  function startEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDueDate(task.dueDate || '');
    setNotes(task.notes || '');
    setPriority(task.priority || 'medium');
    setNotify(!!task.notifyOnComment);
  }

  function saveEdit(e) {
    e.preventDefault();
    const next = tasks.map(t => t.id === editingId ? { ...t, title: title.trim(), dueDate: dueDate || null, notes: notes.trim(), priority, notifyOnComment: !!notify } : t);
    commitTasks(next);
    clearForm();
  }

  function cancelEdit() {
    clearForm();
  }

  function toggleComplete(id) {
    const next = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    commitTasks(next);
  }

  function onDelete(id) {
    if (window.confirm('Delete this task?')) {
      const next = tasks.filter(t => t.id !== id);
      commitTasks(next);
    }
  }

  function clearCompleted() {
    commitTasks(tasks.filter(t => !t.completed));
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
          <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            Priority
            <select
              className="filter-select"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>
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
                <div><strong>Priority:</strong> {(task.priority || 'medium').toUpperCase()}</div>
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
