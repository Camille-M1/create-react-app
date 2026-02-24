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

  // Save current task as template
  const saveTemplate = async () => {
    if (!templateTitle.trim()) return;

    let attachments = [];
    try {
      attachments = await buildAttachments(templateFiles);
    } catch (err) {
      alert('One or more template attachments could not be read. Please try again.');
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

  // Load template into new task form
  const loadTemplate = (template) => {
    setNewTaskTitle(template.title);
    setNewTaskNotes(template.notes);
    setNewTaskDueDate(template.dueDate || '');
    setNewTaskPriority(template.priority || 'medium');
    setNewTaskTemplateAttachments(template.attachments || []);
    setNewTaskAttachmentFiles([]);
    setShowCreateFromTemplate(true);
  };

  // Create task from template
  const createTaskFromTemplate = async () => {
    if (!newTaskTitle.trim()) return;

    let addedAttachments = [];
    try {
      addedAttachments = await buildAttachments(newTaskAttachmentFiles);
    } catch (err) {
      alert('One or more task attachments could not be read. Please try again.');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      text: newTaskTitle.trim(),
      dueDate: newTaskDueDate || null,
      notes: newTaskNotes.trim(),
      priority: newTaskPriority,
      attachments: [...newTaskTemplateAttachments, ...addedAttachments],
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
    setNewTaskPriority('medium');
    setNewTaskTemplateAttachments([]);
    setNewTaskAttachmentFiles([]);
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
            <select
              className="filter-select"
              value={templatePriority}
              onChange={e => setTemplatePriority(e.target.value)}
              style={{ minWidth: 140 }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              type="file"
              multiple
              onChange={e => setTemplateFiles(Array.from(e.target.files || []))}
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
                <span style={{ marginLeft: 8 }}>Priority: {(tpl.priority || 'medium').toUpperCase()}</span>
                {tpl.notes && <span style={{ marginLeft: 8 }}>Notes: {tpl.notes}</span>}
                {(tpl.attachments || []).length > 0 && <span style={{ marginLeft: 8 }}>Attachments: {tpl.attachments.length}</span>}
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
            <select
              className="filter-select"
              value={newTaskPriority}
              onChange={e => setNewTaskPriority(e.target.value)}
              style={{ marginBottom: 8 }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {(newTaskTemplateAttachments || []).length > 0 && (
              <p style={{ marginBottom: 8, textAlign: 'left' }}>Template attachments: {newTaskTemplateAttachments.length}</p>
            )}
            <input
              type="file"
              multiple
              onChange={e => setNewTaskAttachmentFiles(Array.from(e.target.files || []))}
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
