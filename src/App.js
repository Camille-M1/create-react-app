import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import AddTask from './AddTask';
import TaskList from './TaskList';
import StatusBoard from './StatusBoard';
import RolesPage from './RolesPage'; // Roles management page
import './App.css';

function Home() {
  return (
    <div className="home">
      <header className="App-header">
        <h1 className="site-title">Welcome to TaskPilot</h1>
        <p className="tagline">Manage tasks smarter. Start organizing your day.</p>
      </header>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // for RolesPage

  // Current user role for testing
  const role = "team"; // "admin" | "team" | "system"

  // --- TASK FUNCTIONS ---
  const addTask = (taskText, taskStatus) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      status: taskStatus,
      comment: ''
    };
    setTasks([...tasks, newTask]);
  };

  const onAddComment = (taskId, comment) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, comment } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  return (
    <BrowserRouter>
      <div className="App">
        {/* Navigation bar */}
        <nav className="site-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/tasks" className="nav-link">Tasks</Link>
          <Link to="/roles" className="nav-link">Roles</Link>
        </nav>

        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Task Manager page */}
            <Route
          path="/tasks"
          element={
        <div>
             <h2>Task Manager</h2>
           <AddTask onAddTask={addTask} />
           <TaskList
        tasks={tasks}
        role={role}
        onDeleteTask={deleteTask}
        onAddComment={onAddComment}
      />
      <StatusBoard
        tasks={tasks}
        onStatusChange={updateTaskStatus}
      />
    </div>
  }
/>

            {/* Roles management page */}
            <Route
              path="/roles"
              element={
                <RolesPage users={users} setUsers={setUsers} />
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
