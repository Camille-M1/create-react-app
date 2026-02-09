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
      {statuses.map(status => {
        const filteredTasks = tasks.filter(task => task.status === status.key);
        return (
          <div key={status.key} className="column">
            <h3>{status.label}</h3>

            {filteredTasks.length === 0 && <p style={{ color: '#999', fontSize: '12px' }}>No tasks</p>}
            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                {/* Make only the task name clickable */}
                <a href={`/todos/${task.id}?from=tasks`} style={{ textDecoration: 'underline', color: '#0074d9' }}>
                  {task.text || task.title}
                </a>

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
        );
      })}
    </div>
  );
};

export default StatusBoard;
