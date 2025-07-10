import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MunicipalView.css';

interface Report {
  report_id: number;
  report_location: string;
  report_description: string;
  reported_at: string;
  is_resolved: boolean;
  reporter_name?: string;
}

function MunicipalView() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, unresolved: 0 });
  const [recentReports, setRecentReports] = useState<Report[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reports/illegal-dumpsite/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats({ total: data.total || 0, unresolved: data.unresolved || 0 });
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };

    const fetchRecentReports = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/reports/illegal-dumpsite', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.reports) {
          setRecentReports(data.reports.slice(0, 4)); // Show top 4 recent reports
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      }
    };

    fetchStats();
    fetchRecentReports();
  }, []);

  return (
    <div className="municipal-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">♻️</div>
        <nav>
          <ul>
            <li onClick={() => navigate('/municipal/view-dumpsites')}>View Dumpsites</li>
            <li onClick={() => navigate('/municipal/resolved-unresolved-cases')}>
              Resolved/Unresolved Cases
            </li>
            <li onClick={() => navigate('/municipal/logs')}>Export Logs</li>
          </ul>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="main-content">
        <header className="topbar">
          <div className="nav-left">
            <button onClick={() => navigate('/municipal')}>Home</button>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={() => navigate('/')}>Log Out</button>
          </div>
        </header>

        <section className="dashboard-body">
          <h1 className="welcome-title">WELCOME!!</h1>

          <div className="summary-box">
            <button
              className="check-reports-btn"
              onClick={() => navigate('/municipal/view-dumpsites')}
            >
              CHECK REPORTS
            </button>
            <p className="pending-info">
              Total Reports: <strong>{stats.total}</strong><br />
              Unresolved: <strong>{stats.unresolved}</strong>
            </p>
          </div>

          <div className="recent-reports-preview">
            <h3>📝 Latest Reports</h3>
            {recentReports.length === 0 ? (
              <p>No recent reports.</p>
            ) : (
              recentReports.map((report) => (
                <div key={report.report_id} className="report-preview-card">
                  <p><strong>Location:</strong> {report.report_location}</p>
                  <p><strong>Description:</strong> {report.report_description}</p>
                  <p><strong>Status:</strong> {report.is_resolved ? '✅ Resolved' : '❌ Unresolved'}</p>
                  <p><strong>Date:</strong> {new Date(report.reported_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default MunicipalView;
