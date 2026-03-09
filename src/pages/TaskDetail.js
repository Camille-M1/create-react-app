import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../App.css';

const API_URL = "http://localhost:5050/api/tasks";

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  // FETCH TASK
  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(data => setTask(data))
      .catch(err => console.error(err));
  }, [id]);

  // FETCH COMMENTS
  useEffect(() => {
    fetch(`${API_URL}/${id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error(err));
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await fetch(`${API_URL}/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          text
        })
      });

      // Refresh comments
      const res = await fetch(`${API_URL}/${id}/comments`);
      const updated = await res.json();
      setComments(updated);

      setAuthor('');
      setText('');
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  if (!task) {
    return (
      <div className="todo-page">
        <h2>Task not found</h2>
        <p><Link to="/tasks">Back to Tasks</Link></p>
      </div>
    );
  }

  const priorityValue = (task.priority || 'medium').toLowerCase();
  const priorityLabel = priorityValue.charAt(0).toUpperCase() + priorityValue.slice(1);

  return (
    <div className="todo-page task-detail">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>{task.title}</h2>
        <button className="btn-secondary" onClick={() => window.history.back()}>
          Back
        </button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div><strong>Due:</strong> {task.dueDate || 'No due date'}</div>
        <div>
          <strong>Priority:</strong>
          <span className={`priority-badge ${priorityValue}`}>
            {priorityLabel}
          </span>
        </div>
        {task.description && (
          <div>
            <strong>Description:</strong>
            <div>{task.description}</div>
          </div>
        )}
      </div>

      <section>
        <h3>Discussion</h3>

        <form onSubmit={addComment} style={{ marginBottom: 16 }}>
          <input
            placeholder="Your name (optional)"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <textarea
            placeholder="Add a comment"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ width: '100%', minHeight: 80 }}
          />
          <button className="btn-primary" type="submit" style={{ marginTop: 8 }}>
            Post Comment
          </button>
        </form>

        {comments.length === 0 && (
          <p className="empty">No comments yet.</p>
        )}

        {comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div>
              <strong>{comment.author}</strong>
              {" — "}
              {new Date(comment.createdAt).toLocaleString()}
            </div>
            <div>{comment.text}</div>
          </div>
        ))}
      </section>
    </div>
  );
}