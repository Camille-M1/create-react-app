import React, { useState } from 'react';
import logo from './logo.svg';
import AddTask from './AddTask';
import TaskList from './TaskList';
import StatusBoard from './StatusBoard.js';
import './StatusBoard.css';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (taskText, taskStatus) => {
    const newTask = {
      id: Date.now(),
      text: taskText,        // <-- must be 'text', not something else
      status: taskStatus
    };
    setTasks([...tasks, newTask]);
  };
  

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  const updateTaskStatus = (taskId, newStatus) => {
    setTasks(
      tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };
  return (
    <div className="App">
      <header className="App-header">
        {/* Default CRA content */}
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        {/* Task Manager section */}
        <h2>Task Manager</h2>
        <AddTask onAddTask={addTask} />
        <TaskList tasks={tasks} onDeleteTask={deleteTask} />
        <StatusBoard tasks={tasks} onStatusChange={updateTaskStatus} />

      </header>
    </div>
  );
}

export default App;
