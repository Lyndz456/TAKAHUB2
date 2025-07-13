// AdminPanel.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total_users: 0,
    total_pickups: 0,
    total_badges: 0,
    total_reports: 0,
  });

  useEffect(() => {
    const fetchAdminStats = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5000/api/analytics/admin-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setStats(data);
        } else {
          console.error('❌ Backend responded with error:', data.error);
        }
      } catch (err) {
        console.error('❌ Failed to fetch admin stats:', err);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="admin-page">
      {/* Book-Pickup-style Topbar */}
      <div className="admin-navbar">
  <h2>♻️ TAKAHUB</h2>
  <nav>
    <button onClick={() => navigate('/admin')}>Home</button>
    
    <button onClick={() => navigate('/')}>Logout</button>
  </nav>
</div>


      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="nav-left">
            <button onClick={() => navigate('/admin')}>Home</button>
            <button onClick={() => navigate('/admin/users')}>Users</button>
            <button onClick={() => navigate('/admin/reports')}>Reports</button>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={() => navigate('/')}>Log Out</button>
          </div>
        </header>
      <div className="admin-dashboard-body">
        <h1>WELCOME!!</h1>

        <div className="stats-box">
          <p>Total users: <strong>{totalUsers}</strong></p>
          <p>Total waste sorted: <strong>{totalPickups}</strong></p>
          <p>Total reward points: <strong>{totalBadges}</strong></p>
          <p>Total dumpsite reports: <strong>{totalReports}</strong></p>
        </div>

          <div className="stats-box">
            <p>Total users: <strong>{stats.total_users}</strong></p>
            <p>Total pickups: <strong>{stats.total_pickups}</strong></p>
            <p>Badges issued: <strong>{stats.total_badges}</strong></p>
            <p>Reports: <strong>{stats.total_reports}</strong></p>
          </div>

          <div className="action-buttons">
            <button className="admin-btn" onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
            <button className="admin-btn" onClick={() => navigate('/rewards')}>View Reward Logs</button>
            <button className="admin-btn" onClick={() => navigate('/municipal/resolved-unresolved-cases')}>Generate Reports</button>
            <button className="admin-btn" onClick={() => navigate('/admin/view-dumpsites')}>View Illegal Dumpsites</button>
          </div>
        </section>
        <div className="admin-action-buttons">
          <button onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
          <button onClick={() => navigate('/rewards')}>View Reward Logs</button>
          <button onClick={() => navigate('/municipal/resolved-unresolved-cases')}>Generate Reports</button>
          <button onClick={() => navigate('/admin/view-dumpsites')}>View Illegal Dumpsites</button>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
