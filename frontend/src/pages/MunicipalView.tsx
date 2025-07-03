// src/pages/MunicipalView.tsx
import { useNavigate } from 'react-router-dom';
import './MunicipalView.css';

function MunicipalView() {
  const navigate = useNavigate();

  return (
    <div className="municipal-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">♻️</div>
        <nav>
          <ul>
            <li onClick={() => navigate('/municipal/reports')}>Dumpsite Reports</li>
            <li onClick={() => navigate('/municipal/resolved-unresolved-cases')}>Resolved/Unresolved Cases</li>
            <li onClick={() => navigate('/municipal/logs')}>Export Logs</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="nav-left">
            <button onClick={() => navigate('/municipal')}>Home</button>
            <button onClick={() => navigate('/municipal/reports')}>Reports</button>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={() => navigate('/')}>Log Out</button>
          </div>
        </header>

        {/* Dashboard Body */}
        <section className="dashboard-body">
          <h1 className="welcome-title">WELCOME!!</h1>

          <div className="summary-box">
            <button className="check-reports-btn" onClick={() => navigate('/municipal/reports')}>
              CHECK REPORTS
            </button>
            <p className="pending-info">
              Total Reports: <strong>[ ... ]</strong><br />
              Unresolved: <strong>[ ... ]</strong>
            </p>
          </div>

          <div className="action-buttons">
            <button className="pdf-btn">Export to PDF</button>
            <button className="map-btn">View Map View</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MunicipalView;
