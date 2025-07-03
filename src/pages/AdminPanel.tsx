// src/pages/AdminPanel.tsx
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

function AdminPanel() {
  const navigate = useNavigate();

  // Placeholder variables for future backend integration
  const totalUsers = '...'; // Fetch total users from backend
  const totalPickups = '...'; // Fetch total completed pickups
  const totalBadges = '...'; // Fetch total badges awarded
  const totalReports = '...'; // Fetch total illegal dumpsite reports

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
            <button onClick={() => navigate('/admin/users')}>Users</button>
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
            <p>Total pickups: <strong>{totalPickups}</strong></p>
            <p>Badges issued: <strong>{totalBadges}</strong></p>
            <p>Reports: <strong>{totalReports}</strong></p>
          </div>

<div className="action-buttons">
  <button className="admin-btn" onClick={() => navigate('/admin/manage-users')}>Manage Users</button>
  <button className="admin-btn" onClick={() => navigate('/rewards')}>View Reward Logs</button>
  <button className="admin-btn" onClick={() => navigate('/municipal/resolved-unresolved-cases')}>Generate Reports</button>
  <button
  onClick={() => navigate('/admin/view-dumpsites')}
  className="admin-btn"
>
  View Illegal Dumpsites
</button>


</div>



        </section>
      </div>
    </div>
  );
}

export default AdminPanel;
