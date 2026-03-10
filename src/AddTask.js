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
    <div className="template-card" style={{ marginBottom: "30px" }}>
      <h3 style={{ marginBottom: "15px", fontWeight: "700" }}>
        Quick Add
      </h3>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <input
          className="task-input"
          type="text"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;