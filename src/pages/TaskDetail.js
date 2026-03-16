import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase'; 
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import '../App.css';

export default function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  // FETCH TASK FROM FIRESTORE
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const docRef = doc(db, "tasks", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTask({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No such task in Firestore!");
        }
      } catch (err) {
        console.error("Error fetching task:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const addComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      author: author.trim() || 'Anonymous',
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = doc(db, "tasks", id);
      
      // Using arrayUnion to push the new comment into the Firebase array
      await updateDoc(docRef, {
        comments: arrayUnion(newComment)
      });

      // Update local state so comment shows up immediately
      setTask(prev => ({
        ...prev,
        comments: [...(prev.comments || []), newComment]
      }));

      setAuthor('');
      setText('');
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  if (loading) return <div className="todo-page"><h2>Loading...</h2></div>;

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
  const comments = task.comments || [];

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
        
        {/* FIX: Checking both field names to ensure notes show up */}
        {(task.notes || task.description) && (
          <div style={{ marginTop: 15 }}>
            <strong>Notes:</strong>
            <div className="notes-display" style={{ whiteSpace: 'pre-wrap', marginTop: 5 }}>
              {task.notes || task.description}
            </div>
          </div>
        )}
      </div>

      <section>
        <h3>Discussion</h3>

        <form onSubmit={addComment} style={{ marginBottom: 16 }}>
          <input
            className="task-input"
            placeholder="Your name (optional)"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
          />
          <textarea
            className="task-notes"
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

        <div className="comments-list">
          {comments.slice().reverse().map(comment => (
            <div key={comment.id} className="comment-item" style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <div>
                <strong>{comment.author}</strong>
                <span style={{ fontSize: '0.8rem', color: '#888', marginLeft: 10 }}>
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <div style={{ marginTop: 5 }}>{comment.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}