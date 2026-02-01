import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Todo from './pages/Todo';
import ManageTodo from './pages/ManageTodo';
import TaskDetail from './pages/TaskDetail';

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
  return (
    <BrowserRouter>
      <div className="App">
        <nav className="site-nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/todos" className="nav-link">To‑Do</Link>
        </nav>
        <main className="site-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<Todo />} />
            <Route path="/todos/manage" element={<ManageTodo />} />
            <Route path="/todos/:id" element={<TaskDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
