// src/pages/Login.js
import React, { useState } from "react";
import { auth } from "../firebase";  // Correct path from pages folder
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Email/Password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setMessage(`Login successful! Welcome, ${user.email}`);
      console.log("Logged in user:", user);
    } catch (error) {
      console.error(error);
      setMessage(`Login failed: ${error.message}`);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setMessage(`Google login successful! Welcome, ${user.displayName}`);
      console.log("Google user:", user);
    } catch (error) {
      console.error(error);
      setMessage(`Google login failed: ${error.message}`);
    }
  };

  return (
    <div className="login-page">
      <h1>Log In</h1>

      {/* Email/Password Form */}
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
        <button type="submit" className="btn-primary">
          Log In
        </button>
      </form>
      <p>
       Don't have an account? <a href="/SignUp">Sign up here</a>
      </p>

      {/* Google Login */}
      <button
        onClick={handleGoogleLogin}
        style={{ marginTop: "12px", backgroundColor: "#4285F4", color: "#fff", padding: "8px 16px", border: "none", borderRadius: "4px", cursor: "pointer" }}
      >
        Sign in with Google
      </button>

      {/* Message */}
      {message && <p style={{ marginTop: "12px" }}>{message}</p>}
    </div>
   
  );

}

export default Login;
