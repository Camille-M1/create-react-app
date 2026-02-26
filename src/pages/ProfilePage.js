
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { auth } from '../firebase';
import { updateProfile, updatePassword } from 'firebase/auth';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, loading } = useAuth() || {};
  const [username, setUsername] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  if (loading) {
    return <div className="profile-page"><h2>Profile</h2><p>Loading...</p></div>;
  }

  const handleUsernameChange = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage('');
    try {
      await updateProfile(user, { displayName: username });
      // Update backend with username and role
      await fetch('/api/users/' + user.uid, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: username }),
      });
      setMessage('Username updated successfully!');
    } catch (err) {
      setMessage('Error updating username/role: ' + err.message);
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user || !newPassword) return;
    setSaving(true);
    setMessage('');
    try {
      await updatePassword(user, newPassword);
      setMessage('Password updated successfully!');
    } catch (err) {
      setMessage('Error updating password: ' + err.message);
    }
    setSaving(false);
    setNewPassword('');
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      {user ? (
        <div className="profile-details">
          <p><strong>Name:</strong> {user.displayName || user.name || 'N/A'}</p>
          {user.email && <p><strong>Email:</strong> {user.email}</p>}
          {user.uid && <p><strong>User ID:</strong> {user.uid}</p>}
          <form onSubmit={handleUsernameChange} style={{ marginTop: 24 }}>
            <label>
              Change Username:
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                disabled={saving}
                style={{ marginLeft: 8 }}
              />
            </label>
            <button type="submit" disabled={saving} style={{ marginLeft: 8 }}>Update</button>
          </form>
          <form onSubmit={handlePasswordChange} style={{ marginTop: 16 }}>
            <label>
              Change Password:
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                disabled={saving}
                style={{ marginLeft: 8 }}
              />
            </label>
            <button type="submit" disabled={saving || !newPassword} style={{ marginLeft: 8 }}>Update</button>
          </form>
          {message && <p style={{ marginTop: 16 }}>{message}</p>}
        </div>
      ) : (
        <p>No user information available.</p>
      )}
    </div>
  );
};

export default ProfilePage;
