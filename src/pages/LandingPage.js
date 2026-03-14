import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png'
import teamwork from '../teamwork.png'
import sorting from '../sorting.png'
import dashboard from '../dashboard.png'
import upload from '../upload.png'

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      {/* MATCHES YOUR .hero-section CSS */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-text">
            <h1>Your ultimate task management <span>solution</span></h1>
            <p>Streamline your workflow, crush your goals, and manage your day efficiently with TaskPilot.</p>
            <div className="hero-buttons">
              <Link to="/get-started" className="btn btn-primary">Get Started</Link>
              <Link to="/login" className="btn btn-secondary">Log In</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-box">
              
              <img src={logo} alt="TaskPilot Logo" className="box-logo" />
            </div>
          </div>
        </div>
      </section>

     
      <div className="features">
        
        {/* Cloud Sync Section */}
        <div className="feature-block">
          <div className="feature-text">
            <h3>Cloud Sync</h3>
            <p>Access your tasks anywhere, anytime, on any device.</p>
            <ul>
              <li>Sync across multiple devices</li>
              <li>Work offline & auto-update</li>
              <li>Secure cloud storage</li>
            </ul>
          </div>
            <img src={upload} alt="cloud sync" className="box-upload" />
        </div>

        {/* Team Collaboration Section */}
        <div className="feature-block">
          <div className="feature-text">
            <h3>Team Collaboration</h3>
            <p>Communicate and manage tasks with your team in real-time.</p>
            <ul>
              <li>Assign tasks with ease</li>
              <li>Integrated chat & comments</li>
              <li>Track team performance</li>
            </ul>
          </div>
          <img src={teamwork} alt="team" className="box-teamwork" />
        </div>

        {/* Smart Sorting Section */}
        <div className="feature-block">
          <div className="feature-text">
            <h3>Smart Sorting</h3>
            <p>Organize your tasks efficiently and track progress seamlessly.</p>
            <ul>
              <li>Prioritize tasks in seconds</li>
              <li>Automatic reminders</li>
              <li>Visual progress indicators</li>
            </ul>
          </div>
          <img src={sorting} alt="sort" className="box-sorting" />
        </div>

      </div>

      {/* Insights & Reports Section */}
<div className="feature-block">
  <div className="feature-image">
    {/* Using a placeholder or your specific icon asset here */}
    <img src={dashboard} alt="dashboard" className="box-dashboard" />
  </div>
  <div className="feature-text">
    <h3>Insights & Reports</h3>
    <p>Track performance and optimize workflow with analytics.</p>
    <ul>
      <li>✓ Visual dashboards</li>
      <li>✓ Weekly performance reports</li>
      <li>✓ Identify bottlenecks quickly</li>
    </ul>
  </div>
</div>

      {/* MATCHES YOUR .cta-section CSS */}
      <section className="cta-section">
        <h2>Ready to take control of your tasks?</h2>
        <Link to="/get-started" className="btn btn-primary">Get Started Free</Link>
      </section>
    </div>
  );
};

export default LandingPage;