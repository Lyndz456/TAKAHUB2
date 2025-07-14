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
          setRecentReports(data.reports.slice(0, 4));
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
            <li onClick={() => navigate('/municipal/resolved-unresolved-cases')}> Resolved/Unresolved Cases </li>
            
          </ul>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="main-content">
        <header className="admin-navbar">
  <h2>♻️ <span className="brand-name">TAKAHUB</span></h2>
  <nav>
    <button onClick={() => navigate('/municipal')}>Home</button>
    <button onClick={() => navigate('/')}>Logout</button>
  </nav>
</header>


        <section className="dashboard-body">
          <h1 className="welcome-title animate-welcome">WELCOME!!</h1>
<div className="reports-container animate-slide">
  <h3 className="section-heading">📝 Latest Illegal Dumpsite Reports</h3>
  {recentReports.length === 0 ? (
    <p className="no-reports">No recent reports.</p>
  ) : (
    <div className="report-card-slider">
      {recentReports.map((report, index) => (
        <div key={report.report_id} className="report-card" style={{ animationDelay: `${index * 0.2}s` }}>
          <h4>{report.report_location}</h4>
          <p><strong>Description:</strong> {report.report_description}</p>
          <p><strong>Status:</strong> {report.is_resolved ? '✅ Resolved' : '❌ Unresolved'}</p>
          <p><strong>Reported:</strong> {new Date(report.reported_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )}
</div>



         
        </section>
      </div>
    </div>
  );
}

export default MunicipalView;
