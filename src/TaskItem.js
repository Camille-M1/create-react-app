import React from 'react';

const TaskItem = ({ task, onStatusChange, onDeleteTask }) => {

  const toggleStatus = () => {
    if (!onStatusChange) return;

    const currentStatus = task.status?.toLowerCase() || "";
    const newStatus = (currentStatus === "done") ? "todo" : "done";
    
    onStatusChange(task.id, newStatus);
  };

  const isDone = task.status?.toLowerCase() === "done";

  return (
    <div className="task-item">
      <h3>{task.title || task.text || "Untitled"}</h3>

      <p>Status: {task.status}</p>

      <button onClick={toggleStatus}>
        Mark {isDone ? "To Do" : "Done"}
      </button>

      <button onClick={() => onDeleteTask(task.id)}>
        Delete
      </button>
    </div>
  );
};

export default TaskItem;