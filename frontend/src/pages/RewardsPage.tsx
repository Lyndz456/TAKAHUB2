// src/pages/RewardsPage.tsx
import './RewardsPage.css';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function RewardsPage() {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [reward, setReward] = useState({
    reward_points: 0,
    reward_badge: '',
    last_updated: '',
  });

  const [pickupsCompleted, setPickupsCompleted] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch reward points + badge
    fetch('http://localhost:5000/api/rewards/my-rewards', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.reward) setReward(data.reward);
      });

    // Fetch total pickups + waste weight
    fetch('http://localhost:5000/api/waste/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPickupsCompleted(data.total_pickups || 0);
        setTotalWeight(data.total_weight || 0);
      });
  }, []);

  return (
    <div className="rewards-page">
      <header className="topbar">
        <div className="nav-left">
          <button onClick={() => navigate('/resident')}>Home</button>
          <button onClick={() => navigate('/book-pickup')}>Book Pickup</button>
          <button disabled className="active-tab">Rewards</button>
        </div>
        <div className="nav-right">
          <span>Welcome, {user?.username}</span>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="rewards-content">
        <h1>🌟 Your Recycling Rewards</h1>

        <div className="reward-boxes">
          <div className="reward-card">
            <h3>Total Points</h3>
            <p>{reward.reward_points} pts</p>
          </div>

          <div className="reward-card">
            <h3>Pickups Completed</h3>
            <p>{pickupsCompleted}</p>
          </div>

          <div className="reward-card">
            <h3>Current Badge</h3>
            <p>{reward.reward_badge || '🔰 Newbie'}</p>
          </div>

          <div className="reward-card">
            <h3>Waste Disposed</h3>
            <p>{totalWeight.toFixed(2)} KGs</p>
          </div>
        </div>

        <div className="badge-guide">
          <h2>🏆 How to Earn Points & Badges</h2>
          <ol>
            <li>📦 Book pickups for sorted waste — 2 points per KG</li>
            <li>🎖️ Reach 20 pts for Bronze, 50 for Silver, 100+ for Gold</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

export default RewardsPage;
