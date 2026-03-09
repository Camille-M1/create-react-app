import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RolesPage from './RolesPage';
import Todo from './pages/Todo';
import Login from './pages/Login';
import Signup from './pages/signup';
import TasksPage from './pages/TasksPage';
import NewTask from './pages/NewTask';
import ManageTodo from './pages/ManageTodo';
import GetStarted from './pages/GetStarted';
import TaskDetail from './pages/TaskDetail';
import CalendarPage from './pages/CalendarPage';
import './App.css';

const API_URL = "http://localhost:5050/api/tasks";

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const [year, month, day] = String(dateStr).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function startOfDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getDaysUntil(dateStr) {
  const dueDate = parseLocalDate(dateStr);
  if (!dueDate) return null;
  const due = startOfDay(dueDate);
  const today = startOfDay(new Date());
  const diffMs = due.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

function App() {
  const [tasks, setTasks] = useState([]);

  // FETCH TASKS
  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // CREATE TASK
  const handleTaskCreated = useCallback(async (newTask) => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  }, [fetchTasks]);

  // UPDATE STATUS
  const handleStatusChange = useCallback(async (id, status) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  }, [fetchTasks]);

  // DELETE TASK
  const handleDeleteTask = useCallback(async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchTasks();
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }, [fetchTasks]);

  const activeTasks = tasks.filter(task => task.status !== 'done');
  const completedTasks = tasks.filter(task => task.status === 'done');

  const progressPercent = tasks.length > 0
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  const dueSoonCount = activeTasks.filter(task => {
    const daysLeft = getDaysUntil(task.dueDate);
    return daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
  }).length;

  return (
    <div className="App">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          Task<span>Pilot</span>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/calendar" className="nav-link">Calendar</Link>
          <Link to="/tasks" className="nav-link">Tasks</Link>
          <Link to="/todos" className="nav-link">To-Do</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/roles" className="nav-link">Roles</Link>
          <Link to="/get-started" className="btn btn-primary nav-btn">Get Started</Link>
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/todos" element={<Todo tasks={tasks} />} />
        <Route path="/calendar" element={<CalendarPage tasks={tasks} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/tasks"
          element={
            <TasksPage
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onTaskCreated={handleTaskCreated}
            />
          }
        />

        <Route
          path="/tasks/new"
          element={<NewTask onTaskCreated={handleTaskCreated} />}
        />

        {/* ✅ IMPORTANT — Task Detail Route */}
        <Route
          path="/tasks/:id"
          element={<TaskDetail />}
        />

        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/" element={<GetStarted />} />
      </Routes>

      {/* FOOTER */}
      <footer>
        <p>© 2026 TaskPilot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;