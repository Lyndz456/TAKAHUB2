import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MunicipalView.css';

function MunicipalView() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, unresolved: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/api/reports/illegal-dumpsite/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setStats({ total: data.total || 0, unresolved: data.unresolved || 0 });
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };

    fetchStats();
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

      {/* Main Content Area */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="nav-left">
            <button onClick={() => navigate('/municipal')}>Home</button>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={() => navigate('/')}>Log Out</button>
          </div>
        </header>

        {/* Dashboard Body */}
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
              Total Reports: <strong>{stats.total}</strong>
              <br />
              Unresolved: <strong>{stats.unresolved}</strong>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default MunicipalView;
