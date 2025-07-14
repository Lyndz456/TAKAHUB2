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
    <div className="admin-navbar">
      <h2>♻️ TAKAHUB</h2>
      <nav>
        <button onClick={() => navigate('/admin')}>Home</button>
        <button onClick={() => navigate('/')}>Logout</button>
      </nav>
    </div>

    {/* Main Content */}
    <div className="main-content">
      

      <div className="admin-dashboard-body">
        <h1>WELCOME!!</h1>

        <div className="stats-grid">
  <div className="stat-card users">
    👥 <h4>{stats.total_users}</h4>
    <p>Users Registered</p>
  </div>
  <div className="stat-card pickups">
    🚛 <h4>{stats.total_pickups}</h4>
    <p>Total Pickups</p>
  </div>
  <div className="stat-card badges">
    🏅 <h4>{stats.total_badges}</h4>
    <p>Badges Issued</p>
  </div>
  <div className="stat-card reports">
    📄 <h4>{stats.total_reports}</h4>
    <p>Dumpsite Reports</p>
  </div>
</div>


       <div className="admin-section">
  <h3>🛠️ Admin Actions</h3>
  <div className="admin-action-buttons">
    <button onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
    <button onClick={() => navigate('/rewards')}>View Reward Logs</button>
    <button onClick={() => navigate('/municipal/resolved-unresolved-cases')}>Generate Reports</button>
    <button onClick={() => navigate('/admin/view-dumpsites')}>View Illegal Dumpsites</button>
  </div>
</div>

      </div>
    </div>
  </div>
);
}

export default AdminPanel;
