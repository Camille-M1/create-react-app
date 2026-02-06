import React, { useEffect, useState } from 'react';
import '../App.css';

export default function ManageTodo() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [notify, setNotify] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('tasks');
    if (raw) setTasks(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  function dateVal(d) {
    return d && !isNaN(new Date(d)) ? new Date(d).getTime() : Infinity;
  }

  function sortTasks(list) {
    const upcoming = list.filter(t => !t.completed).sort((a, b) => dateVal(a.dueDate) - dateVal(b.dueDate));
    const completed = list.filter(t => t.completed).sort((a, b) => dateVal(a.dueDate) - dateVal(b.dueDate));
    return [...upcoming, ...completed];
  }

  function clearForm() {
    setTitle('');
    setDueDate('');
    setNotes('');
    setEditingId(null);
    setNotify(false);
  }

  function onAdd(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      dueDate: dueDate || null,
      notes: notes.trim(),
      completed: false,
      notifyOnComment: !!notify,
      comments: [],
    };
    setTasks(prev => sortTasks([...prev, newTask]));
    clearForm();
  }

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
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.completed));
  }

  return (
    <div className="todo-page manage-page">
      <h2>Manage To‑Do</h2>

      <form className="task-form" onSubmit={editingId ? saveEdit : onAdd}>
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
          <button type="submit" className="btn-primary">{editingId ? 'Save' : 'Add'}</button>
          {editingId ? (
            <button type="button" className="btn-secondary" onClick={cancelEdit}>Cancel</button>
          ) : (
            <button type="button" className="btn-secondary" onClick={clearForm}>Clear</button>
          )}
        </div>
      </form>

      <div className="task-list">
        {tasks.length === 0 && <p className="empty">No tasks — add one above.</p>}
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
        <button className="btn-secondary" onClick={clearCompleted}>Clear completed</button>
      </div>
    </div>
  );
}
