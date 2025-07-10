import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();

  const [totalUsers, setTotalUsers] = useState('...');
  const [totalPickups, setTotalPickups] = useState('...');
  const [totalBadges, setTotalBadges] = useState('...');
  const [totalReports, setTotalReports] = useState('...');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchAdminStats = async () => {
      try {
        const rewardsRes = await fetch('http://localhost:5000/api/analytics/rewards-summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const rewardsData = await rewardsRes.json();

        if (rewardsRes.ok) {
          setTotalUsers(rewardsData.data.total_users || '0');
          setTotalBadges(rewardsData.data.total_points_distributed || '0');
        }

        const wasteRes = await fetch('http://localhost:5000/api/analytics/waste-summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const wasteData = await wasteRes.json();

        if (wasteRes.ok) {
          const total =
            parseFloat(wasteData.data.total_plastic || 0) +
            parseFloat(wasteData.data.total_organic || 0) +
            parseFloat(wasteData.data.total_hazardous || 0);
          setTotalPickups(total.toFixed(2) + ' kg');
        }

        const reportsRes = await fetch('http://localhost:5000/api/reports/illegal-dumpsite/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const reportsData = await reportsRes.json();

        if (reportsRes.ok) {
          setTotalReports(reportsData.total || '0');
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">♻️</div>
        <nav>
          <ul>
            <li>Overview</li>
            <li>Users</li>
            <li>Pickups</li>
            <li>Rewards</li>
            <li>Dumpsites</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="nav-left">
            <button onClick={() => navigate('/admin')}>Home</button>
            <button onClick={() => navigate('/admin/manage-users')}>Users</button>
            <button onClick={() => navigate('/admin/reports')}>Reports</button>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={() => navigate('/')}>Log Out</button>
          </div>
        </header>

        {/* Welcome + Stats */}
        <section className="dashboard-body">
          <h1>WELCOME!!</h1>

          <div className="stats-box">
            <p>Total users: <strong>{totalUsers}</strong></p>
            <p>Total waste sorted: <strong>{totalPickups}</strong></p>
            <p>Total reward points: <strong>{totalBadges}</strong></p>
            <p>Total dumpsite reports: <strong>{totalReports}</strong></p>
          </div>

          <div className="action-buttons">
            <button className="admin-btn" onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
            <button className="admin-btn" onClick={() => navigate('/rewards')}>View Reward Logs</button>
            <button className="admin-btn" onClick={() => navigate('/municipal/resolved-unresolved-cases')}>Generate Reports</button>
            <button className="admin-btn" onClick={() => navigate('/admin/view-dumpsites')}>View Illegal Dumpsites</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminPanel;
