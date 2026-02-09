import './App.css';
import logo from './logo.png'
function App() {
  return (
    <div className="App">
      
      <nav className="navbar">
        <div className="logo">Task<span>Pilot</span></div>
        <div className="logo-container">
         
        </div>
     
      </nav>

      
      <header className="App-header">
        <div className="hero-content">
        <img src={logo} alt="TaskPilot Logo" className="nav-logo" />
          <h1>Your ultimate task management <span>solution.</span></h1>
          <p>Streamline your workflow, crush your goals, and navigate your day with TaskPilot.</p>
          <div className="button-group">
  <button className="btn-primary">GET STARTED</button>
  <button className="btn-login-main">LOG IN</button>
</div>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>Smart Sorting</h3>
          <p>The Smart Task & Team Management System is a web-based application designed to help teams organize tasks, manage deadlines, assign roles, and track progress. </p>
        </div>
        <div className="feature-card">
          <h3>Cloud Sync</h3>
          <p>Access your tasks from your MacBook or on the go.</p>
        </div>
      </section>
    </div>
  );
}

export default App;