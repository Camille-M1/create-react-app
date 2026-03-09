import React, { useState } from "react";

const AddTask = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("todo");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    onTaskCreated({
      title,
      status,
    });

    setTitle("");
    setStatus("todo");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="todo">To Do</option>
        <option value="done">Done</option>
      </select>

      <button type="submit">Add Task</button>
    </form>
  );
};

export default AddTask;