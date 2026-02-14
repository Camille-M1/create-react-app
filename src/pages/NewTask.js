import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function NewTask({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Fix date handling: ensure dueDate is local day
    // Store dueDate exactly as entered (YYYY-MM-DD)
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      text: title.trim(),
      dueDate: dueDate || null,
      notes: notes.trim(),
      completed: false,
      status: 'todo',
      notifyOnComment: false,
      comments: [],
    };

    if (onTaskCreated) {
      onTaskCreated(newTask);
    } else {
      // Save to localStorage
      const raw = localStorage.getItem('tasks');
      const tasks = raw ? JSON.parse(raw) : [];
      tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Navigate back to tasks page
    navigate('/tasks');
  };

  const handleCancel = () => {
    navigate('/tasks');
  };

  return (
    <div className="todo-page">
      <h2>Create New Task</h2>

      <form className="task-form" onSubmit={handleSubmit}>
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

        <div className="task-form-actions">
          <button type="submit" className="btn-primary">Create Task</button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
