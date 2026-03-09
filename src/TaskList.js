import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onStatusChange, onDeleteTask }) => {
  return (
    <div>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;