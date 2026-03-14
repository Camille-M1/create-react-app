import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { updateProfile, updatePassword, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom'; 
import './ProfilePage.css';
import logo from '../logo.png'; 

const ProfilePage = ({ tasks = [] }) => {
  const { user, loading } = useAuth() || {};
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  // Redirect if logged out to prevent seeing the dashboard
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate('/');
    } catch (err) {
      setMessage('Could not sign out.');
    }
  };

  if (loading) return <div className="profile-page loading"><h2>Loading...</h2></div>;
  if (!user) return null;

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(user, { displayName: username });
      setMessage('Username updated successfully!');
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    setSaving(true);
    setMessage('');
    try {
      await updatePassword(user, newPassword);
      setMessage('Password updated!');
      setNewPassword('');
    } catch (err) {
      setMessage('Error: ' + err.message);
    }
    setSaving(false);
  };

  return (
    <div className="profile-page">
      <div className="profile-dashboard-layout">
        <aside className="profile-sidebar">
          <div className="profile-user-spotlight">
            <img src={logo} alt="Logo" className="large-logo" />
            <h3>{user?.displayName || 'User'}</h3>
            <p className="user-email">{user?.email}</p>
            <button className="btn-logout-sidebar" onClick={handleSignOut}>Sign Out</button>
          </div>
          <nav className="profile-internal-nav">
            <a href="#overview" className="active">Dashboard Overview</a>
            <a href="#settings">Account Settings</a>
            <Link to="/tasks" className="nav-link">Full Task List</Link>
          </nav>
        </aside>

        <main className="profile-main-content">
          <header className="profile-page-header">
            <h1>Dashboard</h1>
            <code className="user-id">UID: {user?.uid.slice(0, 8)}...</code>
          </header>

          <section className="profile-stats-dashboard">
            <div className="stat-card green-accent">
              <div className="stat-text">
                <p className="stat-label">Tasks Done</p>
                <h2 className="stat-value">{tasks.filter(t => t.status === 'Done').length}</h2>
              </div>
            </div>
            <div className="stat-card blue-accent">
              <div className="stat-text">
                <p className="stat-label">In Progress</p>
                <h2 className="stat-value">{tasks.filter(t => t.status === 'In Progress').length}</h2>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-text">
                <p className="stat-label">Total Tasks</p>
                <h2 className="stat-value">{tasks.length}</h2>
              </div>
            </div>
          </section>

          
          <section className="dashboard-feature-section" id="overview">
            <div className="tasks-preview-card">
              <div className="card-header">
                <h3>Recent Activity</h3>
                <Link to="/tasks" className="view-all-btn">View All</Link>
              </div>
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Deadline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length > 0 ? (
                    tasks.slice(0, 5).map((task, index) => (
                      <tr key={task.id || index}>
                        <td>{task.title}</td>
                        <td>{task.dueDate || 'No Deadline'}</td>
                        <td>
                          <span className={`badge ${task.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {task.status || 'To Do'}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="3" className="empty-row">No tasks found. Create one to get started!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="settings-section-grid" id="settings">
            <div className="setting-box">
              <h3>Personal Info</h3>
              <form onSubmit={handleUsernameChange}>
                <label>Display Name</label>
                <div className="form-row">
                  <input value={username} onChange={e => setUsername(e.target.value)} disabled={saving} />
                  <button type="submit" className="btn-primary" disabled={saving}>Save</button>
                </div>
              </form>
            </div>
            <div className="setting-box">
              <h3>Security</h3>
              <form onSubmit={handlePasswordChange}>
                <label>New Password</label>
                <div className="form-row">
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} disabled={saving} />
                  <button type="submit" className="btn-secondary" disabled={saving || !newPassword}>Update</button>
                </div>
              </form>
            </div>
          </div>
          {message && <p className="message-banner">{message}</p>}
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;