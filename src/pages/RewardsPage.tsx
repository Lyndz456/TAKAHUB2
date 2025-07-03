// src/pages/RewardsPage.tsx
import './RewardsPage.css';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function RewardsPage() {
    const navigate = useNavigate();
    const { user, logout } = useUser();
    
  

  // Dummy logic — replace with real backend data later
  const pickupsCompleted = 4;
  const totalPoints = 210;
  const badges = pickupsCompleted >= 5
    ? '🏅 Silver'
    : pickupsCompleted >= 3
    ? '🥉 Bronze'
    : '🔰 Newbie';

  return (

    <div className="rewards-page">
      <header className="topbar">
        <div className="nav-left">
          <button  onClick={() => navigate ('/resident')}>Home</button>
          <button onClick ={() => navigate  ('/book-pickup')} >Book Pickup</button>
          <button disabled className="active-tab">Rewards</button>
        </div>
        <div className="nav-right">
          <span>Welcome, {user?.username}</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="rewards-content">
        <h1>🌟 Your Recycling Rewards</h1>

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
            <h3>Badge Earned</h3>
            <p>{badges}</p>
          </div>
        </div>

        <div className="reward-message">
          {totalPoints >= 200
            ? '🎉 You’re eligible for a reward! Keep sorting!'
            : 'Keep going! Sort more waste to earn rewards 💪'}
        </div>
      </main>
    </div>
  );
}

export default RewardsPage;
