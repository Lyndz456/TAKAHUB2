// src/pages/RewardsPage.tsx
import './RewardsPage.css';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function RewardsPage() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  // These will later be fetched from the backend
  const totalPoints = 0;
  const pickupsCompleted = 0;

  const badge =
    totalPoints >= 100 ? '🥇 Gold' :
    totalPoints >= 50 ? '🥈 Silver' :
    totalPoints >= 20 ? '🥉 Bronze' :
    '🔰 Newbie';

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
          <div className="reward-boxes">
  <div className="reward-card">
    <h3>Total Points</h3>
    <p>{totalPoints} pts</p>
  </div>

  <div className="reward-card">
    <h3>Pickups Completed</h3>
    <p>{pickupsCompleted}</p>
  </div>

  <div className="reward-card">
    <h3>Current Badge</h3>
    <p>{badge}</p>
  </div>

  <div className="reward-card">
    <h3>Waste Disposed</h3>
    <p>0 KGs</p> {/* 🔗 This will later be fetched from backend */}
  </div>
</div>

        </div>

        <div className="badge-guide">
          <h2>🏆 How to Earn Points & Badges</h2>
          <ol>
            <li>📦 Book pickups for sorted waste — 10 points per pickup</li>
            <li>🔁 Consistently recycle weekly — 20 points bonus</li>
            <li>🚮 Report illegal dumpsites — 15 points per valid report</li>
            <li>📸 Attach photo proof for bonus points</li>
            <li>🎖️ Reach 20 pts for Bronze, 50 for Silver, 100+ for Gold</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

export default RewardsPage;
