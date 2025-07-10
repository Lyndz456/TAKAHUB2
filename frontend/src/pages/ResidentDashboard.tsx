// src/pages/ResidentDashboard.tsx
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
  const [badge, setBadge] = useState<string | null>('None');
  const [pickups, setPickups] = useState<number>(0);
  const [latestRequest, setLatestRequest] = useState<any>(null);
  const [showPopup, setShowPopup] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');

      try {
        // ✅ Fetch reward stats
        const rewardRes = await axios.get('http://localhost:5000/api/waste/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { reward_points, reward_badge, total_pickups } = rewardRes.data;
        setPoints(reward_points || 0);
        setBadge(reward_badge || 'None');
        setPickups(total_pickups || 0);

        // ✅ Fetch pickup request
        const reqRes = await axios.get('http://localhost:5000/api/pickup/my-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (reqRes.data.requests?.length > 0) {
          const latest = reqRes.data.requests[0];

          // ✅ Pop-up alerts based on status
          if (latest.status === 'accepted') {
            setShowPopup('✅ Your pickup request has been accepted!');
          }
          if (latest.status === 'completed') {
            setShowPopup('🎉 Pickup completed! Rewards have been added.');
          }

          setLatestRequest(latest);
        } else {
          setLatestRequest(null);
        }

      } catch (error) {
        console.error('❌ Error fetching dashboard data:', error);
      }
    };

    // Initial and periodic refresh
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, [user?.username, location.key]);

  const formatStatus = (status: string, reason?: string) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending';
      case 'accepted':
        return '✅ Accepted - Awaiting collection';
      case 'collected':
        return '🚛 Collected';
      case 'completed':
        return '🏁 Completed - Rewards granted';
      case 'rejected':
        return `❌ Rejected${reason ? ` - ${reason}` : ''}`;
      default:
        return status;
    }
  };

  return (
    <div className="resident-dashboard">
      {/* ✅ Pop-up Message */}
      {showPopup && (
        <div className="popup">
          <p>{showPopup}</p>
          <button onClick={() => setShowPopup(null)}>✖</button>
        </div>
      )}

      {/* ✅ Sidebar */}
      <aside className="sidebar">
        <div className="logo">♻️</div>
        <nav>
          <ul>
            <li onClick={() => navigate('/book-pickup')}>📦 Pickups</li>
            <li onClick={() => navigate('/sorting-guide')}>📘 Sorting Guide</li>
            <li onClick={() => navigate('/rewards-page')}>🏆 Rewards</li>
          </ul>
        </nav>
      </aside>

      {/* ✅ Main Section */}
      <div className="main-content">
        <header className="topbar">
          <div className="nav-left">
            <button onClick={() => navigate('/resident')}>Home</button>
            <button onClick={() => navigate('/book-pickup')}>Book Pickup</button>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={() => {
              logout();
              navigate('/');
            }}>Log Out</button>
          </div>
        </header>

        <section className="dashboard-body">
          <h1>WELCOME!!</h1>

          {/* ✅ Stats */}
          <div className="stats-box">
            <p>Points: <strong>{points}</strong></p>
            <p>Pickups: <strong>{pickups}</strong></p>
            <p>Badge: <strong>{badge}</strong></p>
          </div>

          {/* ✅ Latest Pickup Info */}
          {latestRequest ? (
            <div className="pickup-info">
              <p><strong>Pickup Date:</strong> {latestRequest.pickup_date}</p>
              <p><strong>Location:</strong> {latestRequest.location}</p>
              <p><strong>Status:</strong> {formatStatus(latestRequest.status, latestRequest.reason)}</p>
            </div>
          ) : (
            <p><em>No pickup requests yet.</em></p>
          )}

          <div className="dashboard-buttons">
            <button className="cta-btn" onClick={() => navigate('/sorting-guide')}>
              📘 How to Sort Waste
            </button>
            <button className="cta-btn" onClick={() => navigate('/report-dumpsite')}>
              🛑 Report Illegal Dumpsite
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResidentDashboard;
