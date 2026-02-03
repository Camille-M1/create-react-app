import React from 'react';

const TaskItem = ({ task, onUpdate, onDelete }) => {
  const handleUpdate = () => {
    const updatedTask = prompt('Update task:', task.name);
    if (updatedTask) {
      onUpdate(task.id, updatedTask);
    }
  };

  return (
    <div className="task-item">
      <h3>{task.name}</h3>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </div>
  );
};

export default TaskItem;