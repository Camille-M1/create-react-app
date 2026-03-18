import React, { useState } from 'react';
import '../App.css';

function dateVal(d) {
  return d && !isNaN(new Date(d)) ? new Date(d).getTime() : Infinity;
}

function sortTasks(list) {
  const upcoming = list.filter(t => !(t.completed || t.status === 'done' || t.status === 'Done')).sort((a, b) => dateVal(a.dueDate) - dateVal(b.dueDate));
  const completed = list.filter(t => (t.completed || t.status === 'done' || t.status === 'Done')).sort((a, b) => dateVal(a.dueDate) - dateVal(b.dueDate));
  return [...upcoming, ...completed];
}

function normalizeTasks(list) {
  return sortTasks(list.filter(t => !t.archived));
}

// Updated props to include handleStatusChange and handleDeleteTask from App.js
export default function ManageTodo({ tasks: initialTasks = [], onStatusChange, onDeleteTask }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);
  const [notify, setNotify] = useState(false);

  // Normalize the tasks based on the shared initialTasks prop
  const tasks = normalizeTasks(initialTasks);

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
    // Use the onStatusChange or a dedicated update function if you add one to App.js
    // For now, this logic maintains consistency with your Edit form
    if (onStatusChange) {
      // If you have a handleTaskUpdate in App.js, call it here. 
      // Otherwise, we toggle status to save simple edits if that's all that's available.
      const currentTask = tasks.find(t => t.id === editingId);
      onStatusChange(editingId, currentTask.status); 
    }
    clearForm();
  }

  function cancelEdit() {
    clearForm();
  }

  function toggleComplete(task) {
    if (!onStatusChange) return;
    const isDone = task.status === 'done' || task.status === 'Done' || task.completed;
    const newStatus = isDone ? 'To Do' : 'Done';
    onStatusChange(task.id, newStatus);
  }

  function onDelete(id) {
    if (window.confirm('Delete this task?')) {
      if (onDeleteTask) {
        onDeleteTask(id);
      }
    }
  }

  function clearCompleted() {
    const completedTasks = tasks.filter(t => t.completed || t.status === 'done' || t.status === 'Done');
    if (window.confirm(`Delete ${completedTasks.length} completed tasks?`)) {
      completedTasks.forEach(t => onDeleteTask(t.id));
    }
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
        {tasks.map(task => {
          const isDone = task.completed || task.status === 'done' || task.status === 'Done';
          return (
            <div key={task.id} className={`task-item ${isDone ? 'completed' : ''}`}>
              <div className="task-main">
                <input 
                  type="checkbox" 
                  checked={isDone} 
                  onChange={() => toggleComplete(task)} 
                />
                <div className="task-meta">
                  <div className="task-title">{task.title}</div>
                  <div className={`task-due ${task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </div>
                  <div><strong>Priority:</strong> {(task.priority || 'medium').toUpperCase()}</div>
                  {task.notes && <div className="task-notes-text">{task.notes}</div>}
                </div>
              </div>
              <div className="task-actions">
                <button className="btn-link" onClick={() => startEdit(task)}>Edit</button>
                <button className="btn-link danger" onClick={() => onDelete(task.id)}>Delete</button>
              </div>
            </div>
          );
        })}
      </div>
    <div className="footer-actions" style={{ marginTop: 12 }}>
      <button className="btn-secondary" onClick={clearCompleted}>Clear selected</button>
    </div>
  </div>
  );
}
