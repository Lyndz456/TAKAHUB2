// src/pages/ResidentDashboard.tsx
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import './ResidentDashboard.css';

function ResidentDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useUser();

  const [points, setPoints] = useState<number>(0);
  const [pickups, setPickups] = useState<number>(0);
  const [badges, setBadges] = useState<number>(0);
  const [latestRequest, setLatestRequest] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user-dashboard/${user?.username}`);
        setPoints(res.data.points || 0);
        setPickups(res.data.totalPickups || 0);
        setBadges(res.data.badges || 0);
        setLatestRequest(res.data.latestRequest || null);
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      }
    };

    if (user?.username) {
      fetchDashboardData();
    }
  }, [user?.username]);

  return (
    <div className="resident-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">♻️</div>
        <nav>
          <ul>
            
            <li onClick={() => navigate('/book-pickup')}>Pickups</li>
            <li onClick={() => navigate('/sorting-guide')}>Sorting Guide</li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="topbar">
          <div className="nav-left">
            <button onClick={() => navigate('/resident')}>Home</button>
            <button onClick={() => navigate('/book-pickup')}>Book Pickup</button>
            <button onClick={() => navigate('/rewards-page')}>Rewards</button>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={logout}>Log Out</button>
          </div>
        </header>

        <section className="dashboard-body">
          <h1>WELCOME!!</h1>
          <div className="stats-box">
            <p>Points: <strong>{points}</strong></p>
            <p>Pickups: <strong>{pickups}</strong></p>
            <p>Badges: <strong>{badges}</strong></p>
          </div>

          {latestRequest ? (
            <div className="pickup-info">
              <p><strong>Next Pickup:</strong> {latestRequest.pickup_date}</p>
              <p><strong>Location:</strong> {latestRequest.location}</p>
              <p><strong>Status:</strong> {
                latestRequest.status === 'accepted' ? '✅ Accepted' :
                latestRequest.status === 'rejected' ? `❌ Rejected - ${latestRequest.reason}` :
                '⏳ Pending'
              }</p>
            </div>
          ) : (
            <p style={{ marginTop: '1rem' }}><em>No pickup requests yet.</em></p>
          )}

          <div className="dashboard-buttons">
            <button className="cta-btn" onClick={() => navigate('/sorting-guide')}>
              How to sort waste
            </button>
            <button className="cta-btn" onClick={() => navigate('/report-dumpsite')}>
              Report Illegal Dumpsites
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResidentDashboard;
