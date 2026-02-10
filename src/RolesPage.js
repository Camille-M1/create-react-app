import React, { useState } from "react";

const RolesPage = ({ users, setUsers }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("team");

  const addUser = () => {
    if (!name.trim()) return;

    setUsers([
      ...users,
      {
        id: Date.now(),
        name,
        role,
      },
    ]);

    setName("");
    setRole("team");
  };

  const changeRole = (id, newRole) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, role: newRole } : user
      )
    );
  };

  const removeUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="page">
      <h2>User & Role Management</h2>

      {/* Add user */}
      <div style={{ marginBottom: "16px" }}>
        <input
          placeholder="User name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="team">Team Member</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={addUser}>Add User</button>
      </div>

      {/* User list */}
      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: "8px" }}>
            <strong>{user.name}</strong> — {user.role}

            <select
              value={user.role}
              onChange={(e) => changeRole(user.id, e.target.value)}
              style={{ marginLeft: "8px" }}
            >
              <option value="team">Team Member</option>
              <option value="admin">Admin</option>
            </select>

            <button
              style={{ marginLeft: "8px", color: "red" }}
              onClick={() => removeUser(user.id)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RolesPage;
