import React, { useEffect, useState } from 'react';
import { useParams, Link, /*useNavigate, useLocation*/ } from 'react-router-dom';
import '../App.css';
//comment out import that are not used for vercel

export default function TaskDetail() {
  const { id } = useParams();
  //const navigate = useNavigate();
  //const location = useLocation();
  //const fromTasks = new URLSearchParams(location.search).get('from') === 'tasks';
  const [task, setTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem('tasks');
    if (raw) {
      const list = JSON.parse(raw);
      setTasks(list);
      const found = list.find(t => String(t.id) === String(id));
      setTask(found || null);
    }
  }, [id]);

  useEffect(() => {
    if (task) {
      // refresh tasks array when task updates
      const raw = localStorage.getItem('tasks');
      if (raw) setTasks(JSON.parse(raw));
    }
  }, [task]);

  function saveTasks(next) {
    localStorage.setItem('tasks', JSON.stringify(next));
    setTasks(next);
    const found = next.find(t => String(t.id) === String(id));
    setTask(found || null);
  }

  function addComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const newComment = {
      id: Date.now().toString(),
      author: author.trim() || 'Anonymous',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    const next = tasks.map(t => t.id === task.id ? { ...t, comments: [...(t.comments || []), newComment] } : t);
    saveTasks(next);
    setAuthor('');
    setText('');

    // If notifications are enabled for this task, try to show a browser notification
    try {
      if (task.notifyOnComment && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(`Comment on: ${task.title}`, { body: `${newComment.author}: ${newComment.text}` });
      }
    } catch (err) {
      console.error('Notification failed', err);
    }
  }

  function toggleNotify(e) {
    const next = tasks.map(t => t.id === task.id ? { ...t, notifyOnComment: e.target.checked } : t);
    saveTasks(next);
  }

  function requestPermission() {
    if (!('Notification' in window)) {
      alert('Browser does not support notifications.');
      return;
    }
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        alert('Notifications enabled for this browser. You still need to enable per-task notifications by toggling the checkbox.');
      }
    });
  }

  if (!task) {
    return (
      <div className="todo-page">
        <h2>Task not found</h2>
        <p className="empty">The task with id <code>{id}</code> was not found.</p>
        <p><Link to="/todos">Back to To‑Do</Link></p>
      </div>
    );
  }

  return (
    <div className="todo-page task-detail">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{task.title}</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" onClick={() => window.history.back()}>Back</button>
          <Link to="/todos/manage" className="btn-primary">Manage tasks</Link>
        </div>
      </div>

      <div className="task-meta" style={{ marginBottom: 12 }}>
        <div><strong>Due:</strong> {task.dueDate ? task.dueDate : 'No due date'}</div>
        {task.notes && <div style={{ marginTop: 6 }}><strong>Notes:</strong><div className="task-notes-text">{task.notes}</div></div>}
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }} className="notify-toggle">
          <input type="checkbox" checked={!!task.notifyOnComment} onChange={toggleNotify} /> Notify
        </label>
        {('Notification' in window && Notification.permission !== 'granted') && (
          <button className="btn-secondary" style={{ marginLeft: 8 }} onClick={requestPermission}>Enable browser notifications</button>
        )}
      </div>

      <section>
        <h3>Discussion</h3>
        <form onSubmit={addComment} style={{ marginBottom: 12 }}>
          <input placeholder="Your name (optional)" value={author} onChange={e => setAuthor(e.target.value)} style={{ padding: 6, width: '100%', marginBottom: 8 }} />
          <textarea placeholder="Add a comment" value={text} onChange={e => setText(e.target.value)} style={{ padding: 8, width: '100%', minHeight: 80 }} />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button className="btn-primary" type="submit">Post comment</button>
            <button type="button" className="btn-secondary" onClick={() => { setAuthor(''); setText(''); }}>Clear</button>
          </div>
        </form>

        <div className="comment-list">
          {(task.comments || []).length === 0 && <p className="empty">No comments yet — start the discussion.</p>}
          {(task.comments || []).slice().reverse().map(c => (
            <div key={c.id} className="comment-item">
              <div className="comment-author">{c.author} <span className="comment-time">{new Date(c.createdAt).toLocaleString()}</span></div>
              <div className="comment-text">{c.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
