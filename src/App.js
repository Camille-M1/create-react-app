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
    </div>
  );
}

// ---------- MAIN APP ----------
function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (taskText, taskStatus) => {
    const newTask = {
      id: Date.now(),
      text: taskText,
      status: taskStatus || "todo",
    };
    setTasks([...tasks, newTask]);
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
