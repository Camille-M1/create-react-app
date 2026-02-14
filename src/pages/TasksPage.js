import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBoard from '../StatusBoard';
import TaskList from '../TaskList';
import '../App.css';

const TasksPage = ({ tasks = [], onStatusChange, onDeleteTask, onTaskCreated }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateFromTemplate, setShowCreateFromTemplate] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateNotes, setTemplateNotes] = useState('');
  const [templateDueDate, setTemplateDueDate] = useState('');
  const [templates, setTemplates] = useState(() => {
    const raw = localStorage.getItem('taskTemplates');
    return raw ? JSON.parse(raw) : [];
  });

  // Save current task as template
  const saveTemplate = () => {
    if (!templateTitle.trim()) return;
    const newTemplate = {
      title: templateTitle.trim(),
      notes: templateNotes.trim(),
      dueDate: templateDueDate || null,
    };
    const next = [...templates, newTemplate];
    setTemplates(next);
    localStorage.setItem('taskTemplates', JSON.stringify(next));
    setTemplateTitle('');
    setTemplateNotes('');
    setTemplateDueDate('');
  };

  // Load template into new task form
  const loadTemplate = (template) => {
    setNewTaskTitle(template.title);
    setNewTaskNotes(template.notes);
    setNewTaskDueDate(template.dueDate || '');
    setShowCreateFromTemplate(true);
  };

  // Create task from template
  const createTaskFromTemplate = () => {
    if (!newTaskTitle.trim()) return;
    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      text: newTaskTitle.trim(),
      dueDate: newTaskDueDate || null,
      notes: newTaskNotes.trim(),
      completed: false,
      status: 'todo',
      notifyOnComment: false,
      comments: [],
    };
    if (onTaskCreated) {
      onTaskCreated(newTask);
    } else {
      // Save to localStorage
      const raw = localStorage.getItem('tasks');
      const taskList = raw ? JSON.parse(raw) : [];
      taskList.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(taskList));
    }
    setShowCreateFromTemplate(false);
    setNewTaskTitle('');
    setNewTaskNotes('');
    setNewTaskDueDate('');
  };

  // Delete template
  const deleteTemplate = (idx) => {
    const next = templates.filter((_, i) => i !== idx);
    setTemplates(next);
    localStorage.setItem('taskTemplates', JSON.stringify(next));
  };
  return (
    <div className="tasks-page">
      <h2>Tasks</h2>
      <Link to="/tasks/new" className="btn-secondary" style={{ marginBottom: '20px', display: 'inline-block' }} title="Create a new task">
        New Tasks
      </Link>

      <button className="btn-primary" style={{ marginBottom: 16 }} onClick={() => setShowTemplates(v => !v)}>
        {showTemplates ? 'Hide Templates' : 'Templates'}
      </button>

      {showTemplates && (
        <div className="template-section" style={{ marginBottom: 24, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>

          <h3>Save Task Template</h3>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap' }}>
            <input
              className="task-input"
              placeholder="Template title"
              value={templateTitle}
              onChange={e => setTemplateTitle(e.target.value)}
              style={{ minWidth: 180 }}
            />
            <input
              type="date"
              className="task-date"
              value={templateDueDate}
              onChange={e => setTemplateDueDate(e.target.value)}
              style={{ minWidth: 140 }}
            />
            <textarea
              className="task-notes"
              placeholder="Template notes (optional)"
              value={templateNotes}
              onChange={e => setTemplateNotes(e.target.value)}
              style={{ minWidth: 220, resize: 'vertical' }}
            />
            <button className="btn-secondary" onClick={saveTemplate} style={{ alignSelf: 'flex-end', height: 40 }}>Save as Template</button>
          </div>

          <h4>Templates</h4>
          {templates.length === 0 && <p style={{ color: '#999' }}>No templates saved.</p>}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {templates.map((tpl, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 'bold' }}>{tpl.title}</span>
                {tpl.dueDate && <span style={{ marginLeft: 8 }}>Due: {tpl.dueDate}</span>}
                {tpl.notes && <span style={{ marginLeft: 8 }}>Notes: {tpl.notes}</span>}
                <button className="btn-primary" style={{ marginLeft: 12 }} onClick={() => loadTemplate(tpl)}>Create Task</button>
                <button className="btn-secondary danger" style={{ marginLeft: 8 }} onClick={() => deleteTemplate(idx)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modal for creating task from template */}
      {showCreateFromTemplate && (
        <div className="modal-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.3)', zIndex: 1000 }}>
          <div className="modal" style={{ background: '#fff', padding: 24, borderRadius: 8, maxWidth: 400, margin: '80px auto', position: 'relative' }}>
            <h3>Create Task from Template</h3>
            <input
              className="task-input"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <input
              type="date"
              className="task-date"
              value={newTaskDueDate}
              onChange={e => setNewTaskDueDate(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <textarea
              className="task-notes"
              placeholder="Notes (optional)"
              value={newTaskNotes}
              onChange={e => setNewTaskNotes(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn-primary" onClick={createTaskFromTemplate}>Create Task</button>
              <button className="btn-secondary" onClick={() => setShowCreateFromTemplate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <StatusBoard tasks={tasks} onStatusChange={onStatusChange} />
      <TaskList tasks={tasks} onDeleteTask={onDeleteTask} />
    </div>
  );
};

export default TasksPage;
