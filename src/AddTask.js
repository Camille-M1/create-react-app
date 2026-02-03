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
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="New task"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        required
      />

      <select
        value={taskStatus}
        onChange={(e) => setTaskStatus(e.target.value)}
      >
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTask;
