import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBoard from '../StatusBoard';
import '../App.css';

const TasksPage = ({ tasks = [], onStatusChange, onDeleteTask, onTaskCreated }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateFromTemplate, setShowCreateFromTemplate] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskNotes, setNewTaskNotes] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskTemplateAttachments, setNewTaskTemplateAttachments] = useState([]);
  const [newTaskAttachmentFiles, setNewTaskAttachmentFiles] = useState([]);
  const [templateTitle, setTemplateTitle] = useState('');
  const [templateNotes, setTemplateNotes] = useState('');
  const [templateDueDate, setTemplateDueDate] = useState('');
  const [templatePriority, setTemplatePriority] = useState('medium');
  const [templateFiles, setTemplateFiles] = useState([]);

  const [templates, setTemplates] = useState(() => {
    const raw = localStorage.getItem('taskTemplates');
    return raw ? JSON.parse(raw) : [];
  });

  function toDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  async function buildAttachments(files) {
    return Promise.all(
      files.map(async (file) => ({
        id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl: await toDataUrl(file),
      }))
    );
  }

  const saveTemplate = async () => {
    if (!templateTitle.trim()) return;

    let attachments = [];
    try {
      attachments = await buildAttachments(templateFiles);
    } catch {
      alert('Error reading template attachments.');
      return;
    }

    const newTemplate = {
      title: templateTitle.trim(),
      notes: templateNotes.trim(),
      dueDate: templateDueDate || null,
      priority: templatePriority,
      attachments,
    };

    const next = [...templates, newTemplate];
    setTemplates(next);
    localStorage.setItem('taskTemplates', JSON.stringify(next));

    setTemplateTitle('');
    setTemplateNotes('');
    setTemplateDueDate('');
    setTemplatePriority('medium');
    setTemplateFiles([]);
  };

  const loadTemplate = (template) => {
    setNewTaskTitle(template.title);
    setNewTaskNotes(template.notes);
    setNewTaskDueDate(template.dueDate || '');
    setNewTaskPriority(template.priority || 'medium');
    setNewTaskTemplateAttachments(template.attachments || []);
    setNewTaskAttachmentFiles([]);
    setShowCreateFromTemplate(true);
  };

  const createTaskFromTemplate = async () => {
    if (!newTaskTitle.trim()) return;

    let addedAttachments = [];
    try {
      addedAttachments = await buildAttachments(newTaskAttachmentFiles);
    } catch {
      alert('Error reading task attachments.');
      return;
    }

    const newTask = {
      title: newTaskTitle.trim(),
      description: newTaskNotes.trim(),
      dueDate: newTaskDueDate || null,
      priority: newTaskPriority,
      status: 'todo',
    };

    if (onTaskCreated) {
      onTaskCreated(newTask);
    }

    setShowCreateFromTemplate(false);
    setNewTaskTitle('');
    setNewTaskNotes('');
    setNewTaskDueDate('');
    setNewTaskPriority('medium');
    setNewTaskTemplateAttachments([]);
    setNewTaskAttachmentFiles([]);
  };

  const deleteTemplate = (idx) => {
    const next = templates.filter((_, i) => i !== idx);
    setTemplates(next);
    localStorage.setItem('taskTemplates', JSON.stringify(next));
  };

  return (
    <div className="tasks-page">
      <h2>Tasks</h2>

      <Link
        to="/tasks/new"
        className="btn-secondary"
        style={{ marginBottom: '20px', display: 'inline-block' }}
      >
        New Task
      </Link>

      <button
        className="btn-primary"
        style={{ marginBottom: 16 }}
        onClick={() => setShowTemplates(v => !v)}
      >
        {showTemplates ? 'Hide Templates' : 'Templates'}
      </button>

      {showTemplates && (
        <div style={{ marginBottom: 24 }}>
          <h3>Save Task Template</h3>
          <input
            placeholder="Template title"
            value={templateTitle}
            onChange={e => setTemplateTitle(e.target.value)}
          />
          <button onClick={saveTemplate}>Save Template</button>

          <h4>Templates</h4>
          {templates.map((tpl, idx) => (
            <div key={idx}>
              <strong>{tpl.title}</strong>
              <button onClick={() => loadTemplate(tpl)}>Create Task</button>
              <button onClick={() => deleteTemplate(idx)}>Delete</button>
            </div>
          ))}
        </div>
      )}

      {showCreateFromTemplate && (
        <div>
          <h3>Create Task</h3>
          <input
            placeholder="Task title"
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
          />
          <textarea
            placeholder="Notes"
            value={newTaskNotes}
            onChange={e => setNewTaskNotes(e.target.value)}
          />
          <button onClick={createTaskFromTemplate}>Create</button>
          <button onClick={() => setShowCreateFromTemplate(false)}>Cancel</button>
        </div>
      )}

      {/* 🔥 Only render StatusBoard (NO TaskList anymore) */}
      <StatusBoard
        tasks={tasks}
        onStatusChange={onStatusChange}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
};

export default TasksPage;