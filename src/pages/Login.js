import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/roles");
    } catch (error) {
      setMessage("Login failed. Check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/roles");
    } catch (error) {
      setMessage("Google login failed.");
    }
  };

  return (
    /* 1. auth-container gives you the white card and the 80px margin */
    <div className="auth-container">
      <h2>Log In</h2>

      {/* 2. login-form applies the flex-direction: column and 16px gap */}
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
        
        {/* 3. This button uses your var(--accent) color automatically */}
        <button type="submit">Log In</button>
      </form>

      <div style={{ margin: "10px 0", color: "#888" }}>or</div>

      {/* 4. btn-secondary matches your grey hover style from the CSS */}
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

