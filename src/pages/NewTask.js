import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function NewTask({ onTaskCreated }) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [priority, setPriority] = useState('medium');
  const navigate = useNavigate();

  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  async function buildAttachments(files) {
    const prepared = await Promise.all(
      files.map(async (file) => ({
        id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl: await toDataUrl(file),
      }))
    );
    return prepared;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let attachments = [];
    try {
      attachments = await buildAttachments(attachmentFiles);
    } catch (err) {
      alert('One or more attachments could not be read. Please try again.');
      return;
    }

    // Fix date handling: ensure dueDate is local day
    // Store dueDate exactly as entered (YYYY-MM-DD)
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      text: title.trim(),
      dueDate: dueDate || null,
      notes: notes.trim(),
      attachments,
      priority,
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
        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
          Attachments
          <input
            type="file"
            multiple
            onChange={e => setAttachmentFiles(Array.from(e.target.files || []))}
          />
        </label>
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

        <div className="task-form-actions">
          <button type="submit" className="btn-primary">Create Task</button>
          <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
