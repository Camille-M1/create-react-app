import React from 'react';
import './StatusBoard.css';

const STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
];

const StatusBoard = ({ tasks, onStatusChange }) => {
  
  // Helper to normalize status strings for comparison
  const normalize = (status) => status?.toLowerCase().replace(/\s/g, '') || '';

  return (
    <div className="board">
      {STATUSES.map(status => {
        // Filter tasks by matching normalized versions of the status
        const filteredTasks = tasks.filter(task => 
          normalize(task.status) === normalize(status.value) || 
          normalize(task.status) === normalize(status.label)
        );

        return (
          <div key={status.value} className="column">
            <h3>{status.label}</h3>

            {filteredTasks.length === 0 && (
              <p style={{ color: '#999', fontSize: '12px' }}>No tasks</p>
            )}

            {filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <a
                  href={`/todos/${task.id}?from=tasks`}
                  style={{ textDecoration: 'underline', color: '#0074d9', display: 'block', marginBottom: '8px' }}
                >
                  {task.text || task.title}
                </a>

                <select
                  // Simplified: Find which of our 3 STATUSES matches the current task status
                  value={STATUSES.find(s => 
                    normalize(s.value) === normalize(task.status) || 
                    normalize(s.label) === normalize(task.status)
                  )?.value || 'todo'}
                  
                  onChange={(e) => onStatusChange(task.id, e.target.value)}
                >
                  {STATUSES.map(s => (
                    <option key={s.value} value={s.value}>
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