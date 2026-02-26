import React, { useState } from 'react';

const AddTask = ({ onAddTask }) => {
  const [taskText, setTaskText] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo'); // default

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!taskText) return;

    // Call parent function with task text and selected status
    onAddTask(taskText, taskStatus);

    // Reset input and status
    setTaskText('');
    setTaskStatus('todo');
  };

  return (
    <div className="template-card" style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '15px', fontWeight: '700' }}>Quick Add</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          className="task-input"
          type="text"
          placeholder="New task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          required
        />

        <select
          className="filter-select"
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
        </select>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;