// src/pages/ResidentDashboard.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [animatedPoints, setAnimatedPoints] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');

      try {
        const rewardRes = await axios.get('http://localhost:5000/api/waste/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { reward_points, reward_badge, total_pickups } = rewardRes.data;

        setPoints(reward_points || 0);
        setBadge(reward_badge || 'None');
        setPickups(total_pickups || 0);

        // Animate points count
        let current = 0;
        const step = Math.ceil((reward_points || 0) / 30);
        const interval = setInterval(() => {
          current += step;
          if (current >= (reward_points || 0)) {
            setAnimatedPoints(reward_points || 0);
            clearInterval(interval);
          } else {
            setAnimatedPoints(current);
          }
        }, 30);

        const reqRes = await axios.get('http://localhost:5000/api/pickup/my-requests', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (reqRes.data.requests?.length > 0) {
          const latest = reqRes.data.requests[0];

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

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, [user?.username, location.key]);

  const formatStatus = (status: string, reason?: string) => {
    switch (status) {
      case 'pending': return '⏳ Pending';
      case 'accepted': return '✅ Accepted - Awaiting collection';
      case 'collected': return '🚛 Collected';
      case 'completed': return '🏁 Completed - Rewards granted';
      case 'rejected': return `❌ Rejected${reason ? ` - ${reason}` : ''}`;
      default: return status;
    }
  };

  return (
    <div className="resident-dashboard">
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="popup"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
          >
            <p>{showPopup}</p>
            <button onClick={() => setShowPopup(null)}>✖</button>
          </motion.div>
        )}
      </AnimatePresence>

     <aside className="sidebar">
  <div className="logo">
    ♻️ <span className="brand-name">TAKAHUB</span>
  </div>
  <nav>
    <ul>
      <li onClick={() => navigate('/book-pickup')}>📦 Pickups</li>
      <li onClick={() => navigate('/sorting-guide')}>📘 Sorting Guide</li>
      <li onClick={() => navigate('/rewards-page')}>🏆 Rewards</li>
    </ul>
  </nav>
</aside>


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
          <motion.h1
            className="welcome-text"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            WELCOME!!
          </motion.h1>

          <div className="stat-cards">
            <motion.div
              className="card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <p>Points</p>
              <h2>{animatedPoints}</h2>
            </motion.div>

            <motion.div
              className="card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p>Pickups</p>
              <h2>{pickups}</h2>
            </motion.div>

            <motion.div
              className="card"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p>Badge</p>
              <h2>{badge}</h2>
            </motion.div>
          </div>

          {latestRequest ? (
            <motion.div
              className="pickup-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p><strong>Pickup Date:</strong> {latestRequest.pickup_date}</p>
              <p><strong>Location:</strong> {latestRequest.location}</p>
              <p><strong>Status:</strong> {formatStatus(latestRequest.status, latestRequest.reason)}</p>
            </motion.div>
          ) : (
            <p className="no-request">No pickup requests yet.</p>
          )}

          <div className="dashboard-buttons">
            <motion.button
              className="cta-btn"
              onClick={() => navigate('/sorting-guide')}
              whileHover={{ scale: 1.05 }}
            >
              📘 How to Sort Waste
            </motion.button>
            <motion.button
              className="cta-btn"
              onClick={() => navigate('/report-dumpsite')}
              whileHover={{ scale: 1.05 }}
            >
              🛑 Report Illegal Dumpsite
            </motion.button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResidentDashboard;
