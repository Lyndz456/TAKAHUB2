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
  const [pickupsCompleted, setPickupsCompleted] = useState<number>(0);
  const [totalWeight, setTotalWeight] = useState<number>(0);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchRewards = async () => {
      try {
        // ✅ Fetch rewards (flat structure)
        const rewardRes = await fetch('http://localhost:5000/api/rewards/my-rewards', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const rewardData = await rewardRes.json();

        setReward({
          reward_points: rewardData.reward_points || 0,
          reward_badge: rewardData.reward_badge || '',
          last_updated: rewardData.last_updated || '',
        });

        // ✅ Fetch waste stats
        const statRes = await fetch('http://localhost:5000/api/waste/stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const statData = await statRes.json();
        setPickupsCompleted(statData.total_pickups || 0);
        setTotalWeight(Number(statData.total_weight) || 0);
      } catch (err) {
        console.error('❌ Error loading rewards:', err);
      }
    };

    fetchRewards();
    const interval = setInterval(fetchRewards, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rewards-page">
      <header className="topbar">
        <div className="nav-left">
          <button onClick={() => navigate('/resident')}>Home</button>
          
          
        </div>
        <div className="nav-right">
          
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
            <h3>Total Waste</h3>
            <p>{totalWeight.toFixed(2)} kg</p>
          </div>
        </div>

        <div className="badge-guide">
          <h2>🏆 Badge Guide</h2>
          <ol>
            <li>🟫 20 pts = Bronze</li>
            <li>⬜ 50 pts = Silver</li>
            <li>🟨 100 pts = Gold</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

export default RewardsPage;
