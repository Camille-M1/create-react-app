import React, { useEffect, useState } from "react";

const RolesPage = ({ users = [], setUsers }) => {
  const [name, setName] = useState("");
  const [role, setRole] = useState("team");
  const [localUsers, setLocalUsers] = useState(() => {
    if (typeof window === "undefined") return users;
    try {
      const raw = window.localStorage.getItem("rolesUsers");
      return raw ? JSON.parse(raw) : users;
    } catch (err) {
      console.error("Failed to read rolesUsers", err);
      return users;
    }
  });

  useEffect(() => {
    if (setUsers) {
      setLocalUsers(users);
    }
  }, [users, setUsers]);

  useEffect(() => {
    if (setUsers || typeof window === "undefined") return;
    try {
      window.localStorage.setItem("rolesUsers", JSON.stringify(localUsers));
    } catch (err) {
      console.error("Failed to write rolesUsers", err);
    }
  }, [localUsers, setUsers]);

  const effectiveUsers = setUsers ? users : localUsers;
  const updateUsers = setUsers || setLocalUsers;

  const addUser = () => {
    if (!name.trim()) return;

    updateUsers([
      ...effectiveUsers,
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
    updateUsers(
      effectiveUsers.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
  };

  const removeUser = (id) => {
    updateUsers(effectiveUsers.filter((user) => user.id !== id));
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "16px" }}>User & Role Management</h2>

      {/* Add User Form */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        <input
          placeholder="User name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ flex: "2", padding: "8px", minWidth: "150px" }}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ flex: "1", padding: "8px", minWidth: "120px" }}
        >
          <option value="team">Team Member</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={addUser} style={{ padding: "8px 16px" }}>
          Add User
        </button>
      </div>

      {/* User List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {effectiveUsers.map((user) => (
          <div
            key={user.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "6px",
              justifyContent: "space-between",
            }}
          >
            <span>
              <strong>{user.name}</strong> — {user.role}
            </span>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <select
                value={user.role}
                onChange={(e) => changeRole(user.id, e.target.value)}
                style={{ padding: "4px" }}
              >
                <option value="team">Team Member</option>
                <option value="admin">Admin</option>
              </select>

              <button
                style={{ color: "red", padding: "4px 8px" }}
                onClick={() => removeUser(user.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesPage;
