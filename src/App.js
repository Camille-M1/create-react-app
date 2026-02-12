import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RolesPage from './RolesPage';
import Todo from './pages/Todo';
import Login from './pages/Login';
import TasksPage from './pages/TasksPage';
import NewTask from './pages/NewTask';
import ManageTodo from './pages/ManageTodo';
import GetStarted from './pages/GetStarted';
import './App.css';
import logo from './logo.png';
import sorting from './sorting.png';
import upload from './upload.png';
import teamwork from './teamwork.png';
import dashboard from './dashboard.png';

function App() {
  // Load tasks from localStorage
  const raw = typeof window !== 'undefined' ? window.localStorage.getItem('tasks') : null;
  const tasks = raw ? JSON.parse(raw) : [];

  return (
    <div className="App">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          Task<span>Pilot</span>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="/roles" className="nav-link">Roles</a>
          <a href="/todos" className="nav-link">Todo</a>
          <a href="/login" className="nav-link">Login</a>
          <a href="/tasks" className="nav-link">Tasks</a>
          <button className="btn btn-primary nav-btn">Get Started</button>
        </div>
      </nav>

      <Routes>
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/todos" element={<Todo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/tasks" element={<TasksPage tasks={tasks} />} />
        <Route path="/tasks/new" element={<NewTask />} />
        <Route path="/todos/manage" element={<ManageTodo />} />
        <Route path="/get-started" element={<GetStarted />} />
        {/* Default home page: show GetStarted */}
        <Route path="/" element={
          <>
            {/* HERO */}
            <header className="hero-section">
              <div className="hero-inner">
                <div className="hero-text">
                  <h1>Your ultimate task management <span>solution</span></h1>
                  <p>Streamline your workflow, crush your goals, and manage your day efficiently with TaskPilot.</p>
                  <div className="hero-buttons">
                    <button className="btn btn-primary">Get Started</button>
                    <button className="btn btn-secondary">Log In</button>
                  </div>
                </div>
                <div className="hero-image">
                  <div className="hero-image-box">
                    <img src={logo} alt="TaskPilot Logo" className="box-logo" />
                  </div>
                </div>
              </div>
            </header>

            {/* FEATURES */}
            <section className="features" id="features">
              <div className="feature-block">
                <div className="feature-text">
                  <h3>Smart Sorting</h3>
                  <p>Organize your tasks efficiently and track progress seamlessly.</p>
                  <ul>
                    <li>Prioritize tasks in seconds</li>
                    <li>Automatic reminders</li>
                    <li>Visual progress indicators</li>
                  </ul>
                </div>
                <img src={sorting} alt="Smart Sorting" />
              </div>

              <div className="feature-block">
                <div className="feature-text">
                  <h3>Cloud Sync</h3>
                  <p>Access your tasks anywhere, anytime, on any device.</p>
                  <ul>
                    <li>Sync across multiple devices</li>
                    <li>Work offline & auto-update</li>
                    <li>Secure cloud storage</li>
                  </ul>
                </div>
                <img src={upload} alt="Cloud Sync" />
              </div>

              <div className="feature-block">
                <div className="feature-text">
                  <h3>Team Collaboration</h3>
                  <p>Communicate and manage tasks with your team in real-time.</p>
                  <ul>
                    <li>Assign tasks with ease</li>
                    <li>Integrated chat & comments</li>
                    <li>Track team performance</li>
                  </ul>
                </div>
                <img src={teamwork} alt="Team Collaboration" />
              </div>

              <div className="feature-block">
                <div className="feature-text">
                  <h3>Insights & Reports</h3>
                  <p>Track performance and optimize workflow with analytics.</p>
                  <ul>
                    <li>Visual dashboards</li>
                    <li>Weekly performance reports</li>
                    <li>Identify bottlenecks quickly</li>
                  </ul>
                </div>
                <img src={dashboard} alt="Insights & Reports" />
              </div>
            </section>

            {/* CTA SECTION */}
            <section className="cta-section">
              <h2>Ready to take control of your tasks?</h2>
              <button className="btn btn-primary">Get Started Free</button>
            </section>
          </>
        } />
        {/* No catch-all route; restore original logic */}
      </Routes>

      {/* FOOTER */}
      <footer>
        <p>© 2026 TaskPilot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;








