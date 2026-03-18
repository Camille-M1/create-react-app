import React, { useState } from "react";

const AddTask = ({ onTaskCreated }) => {
  const [title, setTitle] = useState("");
  /* Updated default to match board header casing */
  const [status, setStatus] = useState("To Do"); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;

    onTaskCreated({
      title,
      status, // This now sends "To Do", "In Progress", or "Done"
    });

    setTitle("");
    setStatus("To Do");
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
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <select
          className="filter-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", backgroundColor: "#91b38e", border: "none" }}
        >
          + Add Task
        </button>
      </form>
    </div>
  );
};

export default AddTask;