import './App.css';
import logo from './logo.png'
function App() {
  return (
    <div className="App">
      
      <nav className="navbar">
        <div className="logo">Task<span>Pilot</span></div>
        <div className="logo-container">
          <img src={logo} alt="TaskPilot Logo" className="nav-logo" />
         
        </div>
        <div className="nav-links">
          <button className="btn-login">LOG IN</button>
        </div>
      </nav>

      
      <header className="App-header">
        <div className="hero-content">
          <h1>Your ultimate task management <span>solution.</span></h1>
          <p>Streamline your workflow, crush your goals, and navigate your day with TaskPilot.</p>
          <div className="button-group">
  <button className="btn-primary">GET STARTED</button>
  <button className="btn-login-main">LOG IN</button>
</div>
        </div>
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";

// Pages / Components
import Calendar from "./components/Calendar/Calendar";
import Todo from "./pages/Todo";
import ManageTodo from "./pages/ManageTodo";
import TaskDetail from "./pages/TaskDetail";
import TasksPage from "./pages/TasksPage";

// ---------- HOME PAGE ----------
function Home() {
  return (
    <div className="home">
      <header className="App-header">
        <h1 className="site-title">Welcome to TaskPilot</h1>
        <p className="tagline">
          Manage tasks smarter. Start organizing your day.
        </p>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>Smart Sorting</h3>
          <p>The Smart Task & Team Management System is a web-based application designed to help teams organize tasks, manage deadlines, assign roles, and track progress. </p>
        </div>
        <div className="feature-card">
          <h3>Cloud Sync</h3>
          <p>Access your tasks from your MacBook or on the go.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
// ---------- MAIN APP ----------
function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (taskText, taskStatus) => {
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: taskText,
        status: taskStatus || "todo",
      },
    ]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* NAVIGATION */}
        <nav className="site-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/calendar" className="nav-link">Calendar</Link>
          <Link to="/todos" className="nav-link">To-Do</Link>
          <Link to="/tasks" className="nav-link">Tasks</Link>
        </nav>

        {/* PAGE CONTENT */}
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/todos" element={<Todo tasks={tasks} />} />
            <Route path="/todos/manage" element={<ManageTodo />} />
            <Route path="/todos/:id" element={<TaskDetail />} />
            <Route
              path="/tasks"
              element={
                <TasksPage
                  tasks={tasks}
                  onAddTask={addTask}
                  onStatusChange={updateTaskStatus}
                  onDeleteTask={deleteTask}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
