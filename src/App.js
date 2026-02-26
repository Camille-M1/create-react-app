import React, { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
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
import logo from './logo.png';
import sorting from './sorting.png';
import upload from './upload.png';
import teamwork from './teamwork.png';
import dashboard from './dashboard.png';


const DUE_SOON_DISMISS_KEY = 'dueSoonTaskDismissals';
const TASK_PROGRESS_POPUP_HIDDEN_KEY = 'taskProgressPopupHidden';

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

function dueSoonMessage(daysLeft) {
  if (daysLeft < 0) {
    const overdueDays = Math.abs(daysLeft);
    return overdueDays === 1 ? 'Overdue by 1 day' : `Overdue by ${overdueDays} days`;
  }
  if (daysLeft === 0) return 'Due today';
  if (daysLeft === 1) return 'Due in 1 day';
  return `Due in ${daysLeft} days`;
}

function App() {
  const loadTasks = useCallback(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('tasks');
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Failed to read tasks', err);
      return [];
    }
  }, []);

  const [tasks, setTasks] = useState(() => loadTasks());
  const [dueSoonAlerts, setDueSoonAlerts] = useState([]);
  const [isProgressPopupHidden, setIsProgressPopupHidden] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(TASK_PROGRESS_POPUP_HIDDEN_KEY) === 'true';
  });

  const activeTasks = tasks.filter(task => !task.archived);
  const completedTasks = activeTasks.filter(task => task.completed || task.status === 'done');
  const progressPercent = activeTasks.length > 0
    ? Math.round((completedTasks.length / activeTasks.length) * 100)
    : 0;
  const dueSoonCount = activeTasks.filter(task => {
    if (task.completed || task.status === 'done') return false;
    const daysLeft = getDaysUntil(task.dueDate);
    return daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;
  }).length;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (err) {
      console.error('Failed to write tasks', err);
    }
  }, [tasks]);

  const handleTaskCreated = useCallback((newTask) => {
    setTasks(prev => [...prev, newTask]);
  }, []);

  const handleTasksChange = useCallback((nextTasks) => {
    setTasks(nextTasks);
  }, []);

  const handleStatusChange = useCallback((id, status) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));
  }, []);

  const handleDeleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissDueSoonAlert = useCallback((alertId) => {
    setDueSoonAlerts(prev => prev.filter(a => a.id !== alertId));

    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem(DUE_SOON_DISMISS_KEY);
      const dismissals = raw ? JSON.parse(raw) : {};
      dismissals[alertId] = true;
      window.localStorage.setItem(DUE_SOON_DISMISS_KEY, JSON.stringify(dismissals));
    } catch (err) {
      console.error('Failed to persist due-soon dismissal', err);
    }
  }, []);

  const setProgressPopupHidden = useCallback((hidden) => {
    setIsProgressPopupHidden(hidden);
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(TASK_PROGRESS_POPUP_HIDDEN_KEY, hidden ? 'true' : 'false');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let dismissals = {};
    try {
      const raw = window.localStorage.getItem(DUE_SOON_DISMISS_KEY);
      dismissals = raw ? JSON.parse(raw) : {};
    } catch (err) {
      console.error('Failed to read due-soon dismissals', err);
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    const nextAlerts = tasks
      .filter(task => {
        if (!task.notifyOnComment) return false;
        if (task.completed || task.status === 'done') return false;
        if (!task.dueDate) return false;
        const daysLeft = getDaysUntil(task.dueDate);
        return daysLeft === 7 || daysLeft === 1 || daysLeft === 0 || (daysLeft !== null && daysLeft < 0);
      })
      .map(task => {
        const daysLeft = getDaysUntil(task.dueDate);
        return {
          id: `due-soon:${task.id}:${task.dueDate}:${todayKey}`,
          taskId: task.id,
          title: task.title,
          daysLeft,
        };
      })
      .filter(alert => !dismissals[alert.id])
      .sort((a, b) => a.daysLeft - b.daysLeft);

    setDueSoonAlerts(nextAlerts);
  }, [tasks]);

  return (
    <div className="App">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          Task<span>Pilot</span>
        </div>
        <div className="nav-links">
          <a href="/" className="nav-link">Home</a>
          <a href="/calendar" className="nav-link">Calendar</a>
          <a href="/tasks" className="nav-link">Tasks</a>
          <a href="/todos" className="nav-link">To‑Do</a>
          <a href="/login" className="nav-link">Login</a>
          <a href="/roles" className="nav-link">Roles</a>
          <Link to="/get-started" className="btn btn-primary nav-btn">Get Started</Link>
        </div>
        <div className="nav-profile">
          <Link to="/profile" className="profile-link">
            <span role="img" aria-label="Profile">👤</span> Profile
          </Link>
        </div>
      </nav>

      {dueSoonAlerts.length > 0 && (
        <div className="due-soon-container" aria-live="polite">
          {dueSoonAlerts.map(alert => (
            <div key={alert.id} className="due-soon-alert">
              <div className="due-soon-content">
                <strong>{alert.title}</strong>
                <span>{dueSoonMessage(alert.daysLeft)}</span>
              </div>
              <div className="due-soon-actions">
                <Link to={`/todos/${alert.taskId}`} className="btn-secondary due-soon-link">View</Link>
                <button className="btn-secondary due-soon-dismiss" onClick={() => dismissDueSoonAlert(alert.id)}>Dismiss</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isProgressPopupHidden ? (
        <button className="progress-popup-show" onClick={() => setProgressPopupHidden(false)}>
          Show progress
        </button>
      ) : (
        <div className="task-progress-popup" aria-live="polite">
          <div className="task-progress-header">
            <strong>Task Progress</strong>
            <button className="task-progress-hide" onClick={() => setProgressPopupHidden(true)}>Hide</button>
          </div>

          <div className="task-progress-numbers">{completedTasks.length}/{activeTasks.length} complete</div>
          <div className="task-progress-track">
            <div className="task-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="task-progress-meta">
            <span>{progressPercent}% done</span>
            <span>{dueSoonCount} due this week</span>
          </div>

          <div className="task-progress-actions">
            <Link to="/tasks" className="btn-secondary task-progress-link">Tasks</Link>
            <Link to="/todos" className="btn-secondary task-progress-link">To‑Do</Link>
          </div>
        </div>
      )}

      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/todos" element={<Todo tasks={tasks} />} />
        <Route path="/calendar" element={<CalendarPage tasks={tasks} />} />
        <Route path="/todos/:id" element={<TaskDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />
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
        <Route path="/tasks/new" element={<NewTask onTaskCreated={handleTaskCreated} />} />
        <Route path="/todos/manage" element={<ManageTodo tasks={tasks} onTasksChange={handleTasksChange} />} />
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
                    <Link to="/get-started" className="btn btn-primary">Get Started</Link>
                    <Link to="/login" className="btn btn-secondary">Log In</Link>
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
              <Link to="/get-started" className="btn btn-primary">Get Started Free</Link>
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








