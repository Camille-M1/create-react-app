import React from 'react';
import AddTask from '../AddTask';
import StatusBoard from '../StatusBoard';
import TaskList from '../TaskList';
import '../App.css';

const TasksPage = ({ tasks, onAddTask, onStatusChange, onDeleteTask }) => {
  return (
    <div className="tasks-page">
      <h2>Tasks</h2>
      <AddTask onAddTask={onAddTask} />
      <StatusBoard tasks={tasks} onStatusChange={onStatusChange} />
      <TaskList tasks={tasks} onDeleteTask={onDeleteTask} />
    </div>
  );
};

export default TasksPage;
