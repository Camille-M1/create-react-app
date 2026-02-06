import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import "./App.css";

// Pages / Components
import Calendar from "./components/Calendar/Calendar";
import Todo from "./pages/Todo";
import ManageTodo from "./pages/ManageTodo";
import NewTask from "./pages/NewTask";
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

// ---------- MAIN APP ----------
function App() {
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage on initial mount
    const raw = localStorage.getItem('tasks');
    return raw ? JSON.parse(raw) : [];
  });

  // Sync tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Listen for storage changes from other tabs/windows or NewTask/ManageTodo
  React.useEffect(() => {
    const handleStorageChange = () => {
      const raw = localStorage.getItem('tasks');
      if (raw) setTasks(JSON.parse(raw));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addTask = (taskText, taskStatus) => {
    const newTask = {
      id: Date.now(),
      title: taskText,
      text: taskText,
      status: taskStatus || "todo",
      notes: '',
      dueDate: null,
      completed: false,
      notifyOnComment: false,
      comments: [],
    };
    setTasks([...tasks, newTask]);
  };

  const addTaskFromForm = (taskObj) => {
    setTasks([...tasks, taskObj]);
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              completed: newStatus === 'done',
              // Only archive if explicitly requested elsewhere
            }
          : task
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
            <Route path="/calendar" element={<Calendar tasks={tasks} />} />
            <Route path="/todos" element={<Todo tasks={tasks.filter(t => !t.archived)} allTasks={tasks} />} />
            <Route path="/todos/manage" element={<ManageTodo tasks={tasks} onTasksChange={setTasks} />} />
            <Route path="/todos/:id" element={<TaskDetail />} />
            <Route path="/tasks/new" element={<NewTask onTaskCreated={addTaskFromForm} />} />
            <Route
              path="/tasks"
              element={
                <TasksPage
                  tasks={tasks.filter(t => !t.archived)}
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
