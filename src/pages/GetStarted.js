import React from "react";
import { useNavigate } from "react-router-dom";

function GetStarted() {
  const navigate = useNavigate();

  return (
    <div className="get-started-container">
      <header className="hero-section">
        <h1>Welcome to TaskPilot! </h1>
        <p>The Smart Task & Team Management System is designed to help teams organize tasks, manage deadlines, and track progress.</p>
        <p>
        <button className="hero-btn" onClick={() => navigate("/login")}>
          Create Your First Task
        </button>
        </p>
      </header>

      {/* New Stats Bar to fill space */}
      <div className="stats-bar">
        <div className="stat-item"><strong>1000</strong> Max Users</div>
        <div className="stat-item"><strong>24/7</strong> Availability</div>
        <div className="stat-item"><strong>Daily</strong> Backups</div>
      </div>

      <div className="content-stack">
        {/* Administrator Section */}
        <section className="row admin-row">
          <div className="row-left">
            <span className="row-icon">🛡️</span>
            <h2>Administrator / Manager</h2>
            <p>System Authority</p>
          </div>
          <div className="row-right">
            <ul>
              <li>Managing team members and assigning roles (Admin vs. Member).</li>
              <li>Creating, editing, and assigning tasks with due dates.</li>
              <li>Monitoring team-wide analytics and completion rates.</li>
              <li>Receiving reminders for upcoming or overdue deadlines.</li>
            </ul>
          </div>
        </section>

        {/* Team Member Section */}
        <section className="row member-row">
          <div className="row-left">
            <span className="row-icon">👥</span>
            <h2>Team Member</h2>
            <p>Project Execution</p>
          </div>
          <div className="row-right">
            <ul>
              <li>Viewing tasks specifically assigned to you.</li>
              <li>Updating task statuses and marking them as completed.</li>
              <li>Commenting on tasks and adding project notes.</li>
              <li>Viewing your personal completion progress.</li>
            </ul>
          </div>
        </section>

        {/* System Features Section */}
        <section className="row system-row">
          <div className="row-left">
            <span className="row-icon">⚙️</span>
            <h2>System Features</h2>
            <p>Security & Performance</p>
          </div>
          <div className="row-right">
            <ul>
              <li>Secure authentication and role-based access control.</li>
              <li>Daily data backups to maintain system integrity.</li>
              <li>Responsive design accessible on mobile and Google browsers.</li>
              <li>Automated deadline reminders sent to all users.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}

export default GetStarted;