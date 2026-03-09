import React from 'react';

const TaskItem = ({ task, onStatusChange, onDeleteTask }) => {

  const toggleStatus = () => {
    const newStatus = task.status === "done" ? "todo" : "done";
    onStatusChange(task.id, newStatus);
  };

  return (
    <div className="task-item">
      <h3>{task.title}</h3>

      <p>Status: {task.status}</p>

      <button onClick={toggleStatus}>
        Mark {task.status === "done" ? "To Do" : "Done"}
      </button>

      <button onClick={() => onDeleteTask(task.id)}>
        Delete
      </button>
    </div>
  );
};

export default TaskItem;