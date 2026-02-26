
import React, { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setMessage(`Signup successful! Welcome, ${user.email}`);
      console.log("Signed up user:", user);
      // Optionally, redirect to login page or dashboard here
    } catch (error) {
      console.error(error);
      setMessage(`Signup failed: ${error.message}`);
    }
  };

  return (
    <div className="login-page">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="task-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="task-input"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="task-input"
        />
        <button type="submit" className="btn-primary">
          Sign Up
        </button>
      </form>
      {message && <p style={{ marginTop: "12px" }}>{message}</p>}
    </div>
  );
}

export default Signup;