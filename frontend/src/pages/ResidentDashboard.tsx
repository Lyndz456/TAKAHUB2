import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import './ResidentDashboard.css';

function ResidentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useUser();

  const [points, setPoints] = useState<number>(0);
  const [pickups, setPickups] = useState<number>(0);
  const [badge, setBadge] = useState<string | null>(null);
  const [latestRequest, setLatestRequest] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');

      try {
        // 1. Fetch reward stats
        const rewardRes = await axios.get('http://localhost:5000/api/waste/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPoints(rewardRes.data.reward_points || rewardRes.data.total_points || 0);
        setBadge(rewardRes.data.reward_badge || 'None');
        setPickups(rewardRes.data.total_pickups || 0);

        // 2. Fetch latest pickup request
        const reqRes = await axios.get('http://localhost:5000/api/pickup/my-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (reqRes.data.requests && reqRes.data.requests.length > 0) {
          setLatestRequest(reqRes.data.requests[0]); // latest = first from backend
        } else {
          setLatestRequest(null); // no pickups
        }
      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      }
    };

    if (user?.username) {
      fetchDashboardData();
    }
  }, [user?.username, location.key]); // 🔁 re-run on page revisit

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
            <p>Badge: <strong>{badge}</strong></p>
          </div>

          {latestRequest ? (
            <div className="pickup-info">
              <p><strong>Latest Pickup Date:</strong> {latestRequest.pickup_date}</p>
              <p><strong>Location:</strong> {latestRequest.location}</p>
              <p><strong>Status:</strong> {
                latestRequest.status === 'completed' ? '✅ Completed' :
                latestRequest.status === 'accepted' ? '🟢 Accepted' :
                latestRequest.status === 'rejected' ? `❌ Rejected - ${latestRequest.reason}` :
                '⏳ Pending'
              }</p>
            </div>
          ) : (
            <p style={{ marginTop: '1rem' }}><em>No pickup requests made yet.</em></p>
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
