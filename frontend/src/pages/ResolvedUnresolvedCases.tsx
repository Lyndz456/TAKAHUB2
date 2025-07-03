// src/pages/ResolvedUnresolvedCases.tsx
import { useNavigate } from 'react-router-dom';
import './ResolvedUnresolvedCases.css';

function ResolvedUnresolvedCases() {
  const navigate = useNavigate();

  // Placeholder array - replace with backend data later
  const reports = [
    // Leave array empty for now; backend will populate
  ];

  const generateReport = () => {
    // Placeholder logic: when backend is connected, this will:
    // 1. Group and total waste types.
    // 2. Identify top locations with frequent pickup requests.
    // 3. Format the report and trigger PDF or summary download.
    console.log('Generating waste analysis report...');
    alert('Report generated based on currently displayed data.');
  };

  return (
    <div className="municipal-reports-page">
      {/* Top Bar */}
      <header className="topbar">
        <div className="nav-left">
          <button onClick={() => navigate('/municipal')}>Home</button>
          <button disabled className="active-tab">Reports</button>
        </div>
        <div className="nav-right">
          <button className="logout-btn" onClick={() => navigate('/')}>Log Out</button>
        </div>
      </header>

      <main className="reports-container">
        <h1>Resolved & Unresolved Cases</h1>

        {/* Placeholder for reports */}
        <div className="reports-grid">
          {/* Map over backend reports here later */}
          <p>No reports available. Connect to backend to display cases.</p>
        </div>

        {/* Report Generation Button */}
        <div className="report-footer">
          <button className="generate-report-btn" onClick={generateReport}>
            📊 Generate Waste Analysis Report
          </button>
        </div>
      </main>
    </div>
  );
}

export default ResolvedUnresolvedCases;
