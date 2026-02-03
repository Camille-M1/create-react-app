import React from 'react';
import './StatusBoard.css';

const statuses = [
  { key: 'todo', label: 'To Do' },
  { key: 'inprogress', label: 'In Progress' },
  { key: 'done', label: 'Done' }
];

const StatusBoard = ({ tasks, onStatusChange }) => {
  return (
    <div className="board">
      {statuses.map(status => (
        <div key={status.key} className="column">
          <h3>{status.label}</h3>

          {tasks
            .filter(task => task.status === status.key)
            .map(task => (
              <div key={task.id} className="task-card">
                {/* This is the task name */}
                {task.text}

                {/* Dropdown to change status */}
                <select
                  value={task.status}
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                >
                  {statuses.map(s => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default StatusBoard;
