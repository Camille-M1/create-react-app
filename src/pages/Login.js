import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      setMessage(`Login successful! Welcome, ${user.email}`);
      console.log("Logged in user:", user);
      // Send user info to backend
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });

      if (onLoginSuccess) onLoginSuccess();
      navigate("/tasks");
    } catch (error) {
      setMessage("Login failed. Check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await user.getIdToken();
      localStorage.setItem("token", token);

      setMessage(`Google login successful! Welcome, ${user.displayName}`);
      console.log("Google user:", user);
      // Send user info to backend
      await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }),
      });

      if (onLoginSuccess) onLoginSuccess();
      navigate("/tasks");
    } catch (error) {
      setMessage("Google login failed.");
    }
  };

  return (
    /* 1. auth-container */
    <div className="auth-container">
      <h2>Log In</h2>

      {/* login-form */}
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        
        <button type="submit">Log In</button>
      </form>

      <div style={{ margin: "10px 0", color: "#888" }}>or</div>

      
      <button 
        onClick={handleGoogleLogin} 
        className="btn btn-secondary" 
        style={{ width: "100%", padding: "14px" }}
      >
        Sign in with Google
      </button>

      <p style={{ marginTop: "20px", fontSize: "0.9rem" }}>
        Don't have an account? <Link to="/SignUp" style={{ color: "var(--accent-dark)", fontWeight: "bold" }}>Sign Up</Link>
      </p>

      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default Login;
