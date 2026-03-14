import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { auth, db } from './firebase'; 
import { collection, addDoc, onSnapshot, query, where, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import ProfilePage from './pages/ProfilePage';
import RolesPage from './RolesPage';
import Todo from './pages/Todo';
import Login from './pages/Login';
import Signup from './pages/signup';
import TasksPage from './pages/TasksPage';
import NewTask from './pages/NewTask';
/*import ManageTodo from './pages/ManageTodo';*/
import GetStarted from './pages/GetStarted';
import TaskDetail from './pages/TaskDetail';
import CalendarPage from './pages/CalendarPage';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage'; 
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // FETCH TASKS
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTasks(data);
      });
      return () => unsubscribe();
    } else {
      setTasks([]);
    }
  }, [user]);

  // CREATE TASK
  const handleTaskCreated = async (newTask) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "tasks"), {
        ...newTask,
        userId: user.uid,
        status: newTask.status || "To Do",
        createdAt: serverTimestamp()
      });
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  // UPDATE STATUS
  const handleStatusChange = async (id, status) => {
    try {
      const taskRef = doc(db, "tasks", id);
      await updateDoc(taskRef, { status });
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  // DELETE TASK
  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  if (loading) return null;

  return (
    <div className="App">

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          Task<span>Pilot</span>
        </div>

        <div className="nav-links">
          {user ? (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/calendar" className="nav-link">Calendar</Link>
              <Link to="/tasks" className="nav-link">Tasks</Link>
              <Link to="/todos" className="nav-link">To-Do</Link>
              <Link to="/roles" className="nav-link">Roles</Link>
              <Link to="/get-started" className="btn btn-primary nav-btn">Get Started</Link>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/get-started" className="btn btn-primary nav-btn">Get Started</Link>
            </>
          )}
        </div>

        <div className="nav-profile">
          {user && (
            <Link to="/profile" className="profile-link">
              <span role="img" aria-label="Profile">👤</span> Profile
            </Link>
          )}
        </div>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/roles" element={<RolesPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <ProfilePage tasks={tasks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute user={user}>
              <TasksPage
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onDeleteTask={handleDeleteTask}
                onTaskCreated={handleTaskCreated}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/new"
          element={
            <ProtectedRoute user={user}>
              <NewTask onTaskCreated={handleTaskCreated} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute user={user}>
              <TaskDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute user={user}>
              <CalendarPage tasks={tasks} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/todos"
          element={
            <ProtectedRoute user={user}>
              <Todo tasks={tasks} />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* FOOTER */}
      <footer>
        <p>© 2026 TaskPilot. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
