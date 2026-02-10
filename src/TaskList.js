import React, { useState } from 'react';

const TaskList = ({ tasks, role, onDeleteTask, onAddComment }) => {
  const [comments, setComments] = useState({});

  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id} style={{ marginBottom: '16px' }}>
          <strong>{task.text}</strong>

          {/* SHOW EXISTING COMMENT */}
          {task.comment && (
            <p style={{ marginTop: '6px', fontStyle: 'italic' }}>
              📝 Note: {task.comment}
            </p>
          )}

          {/* TEAM + ADMIN: add comment */}
          {(role === 'admin' || role === 'team') && (
            <div>
              <input
                type="text"
                placeholder="Add a note..."
                value={comments[task.id] || ""}
                onChange={e =>
                  setComments({
                    ...comments,
                    [task.id]: e.target.value,
                  })
                }
              />
              <button
                onClick={() => {
                  onAddComment(task.id, comments[task.id]);
                  setComments({ ...comments, [task.id]: "" });
                }}
              >
                Add Note
              </button>
            </div>
          )}

          {/* ADMIN ONLY */}
          {role === 'admin' && (
            <button
              style={{ marginLeft: '8px', color: 'red' }}
              onClick={() => onDeleteTask(task.id)}
            >
              Delete
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
