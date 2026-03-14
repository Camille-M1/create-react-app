import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBoard from '../StatusBoard';
import TaskList from '../TaskList';
import '../App.css';

const TasksPage = ({ tasks = [], onStatusChange, onDeleteTask, onTaskCreated }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateFromTemplate, setShowCreateFromTemplate] = useState(false);
  const [templateSearch, setTemplateSearch] = useState('');

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

    const newTask = {
      title: newTaskTitle.trim(),
      description: newTaskNotes.trim(),
      dueDate: newTaskDueDate || null,
      priority: newTaskPriority,
      status: 'To Do',
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

  const filteredTemplates = templates.filter(tpl =>
    tpl.title.toLowerCase().includes(templateSearch.toLowerCase())
  );

  return (
    <div className="tasks-page">
      <div className="tasks-dashboard">

        <aside className="tasks-sidebar">
          <div className="template-card">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Quick Actions</h2>

            <Link
              to="/tasks/new"
              className="btn btn-primary"
              style={{ textDecoration: 'none', display: 'block', textAlign: 'center', marginBottom: '12px' }}
            >
              + Create New Task
            </Link>

            <button
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => setShowTemplates(v => !v)}
            >
              {showTemplates ? 'Hide Templates' : 'Templates'}
            </button>
          </div>

          {showTemplates && (
            <div className="template-section">
              <h3>Save Task Template</h3>

              <input
                className="task-input"
                placeholder="Template title"
                value={templateTitle}
                onChange={e => setTemplateTitle(e.target.value)}
              />

              <input
                type="date"
                className="task-date"
                value={templateDueDate}
                onChange={e => setTemplateDueDate(e.target.value)}
              />

              <textarea
                className="task-notes"
                placeholder="Template notes (optional)"
                value={templateNotes}
                onChange={e => setTemplateNotes(e.target.value)}
              />

              <select
                className="filter-select"
                value={templatePriority}
                onChange={e => setTemplatePriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={saveTemplate}
              >
                Save as Template
              </button>

              <h4 style={{ marginTop: '24px' }}>Templates</h4>

              <input
                className="task-input"
                placeholder="🔍 Search templates..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
              />

              <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
                {filteredTemplates.map((tpl, idx) => (
                  <li key={idx} style={{ marginBottom: '10px' }}>
                    <strong>{tpl.title}</strong>
                    <div style={{ marginTop: '6px' }}>
                      <button onClick={() => loadTemplate(tpl)}>Create</button>
                      <button onClick={() => deleteTemplate(idx)}>Delete</button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>

        <main className="tasks-page-content">
          <h2>Project Board</h2>

          <StatusBoard
            tasks={tasks}
            onStatusChange={onStatusChange}
            onDeleteTask={onDeleteTask}
          />

          <div style={{ marginTop: '40px' }}>
            <h3>Task List Overview</h3>
            <TaskList
              tasks={tasks}
              onDeleteTask={onDeleteTask}
            />
          </div>
        </main>
      </div>

      {showCreateFromTemplate && (
        <div className="modal-bg">
          <div className="modal">
            <h3>Create Task from Template</h3>

            <input
              className="task-input"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
            />

            <textarea
              className="task-notes"
              placeholder="Notes"
              value={newTaskNotes}
              onChange={e => setNewTaskNotes(e.target.value)}
            />

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={createTaskFromTemplate}
              >
                Create Task
              </button>

              <button
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowCreateFromTemplate(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;