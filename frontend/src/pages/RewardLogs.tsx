// src/pages/RewardLogs.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RewardLogs.css';

interface RewardLog {
  user_id: string;
  user_name: string;
  user_email: string;
  reward_points: number;
  reward_badge: string | null;
  total_pickups: number;
}

function RewardLogs() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<RewardLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/rewards/admin/logs', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setLogs(data.logs);
      } else {
        setError(data.message || 'Failed to load reward logs');
      }
    } catch (err) {
      setError('Server error while fetching logs');
      console.error('RewardLogs error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDownloadReport = () => {
    let report = 'TAKAHUB - Resident Reward Summary\n\n';
    logs.forEach(log => {
      report += `User ID: ${log.user_id}\n`;
      report += `Name: ${log.user_name}\n`;
      report += `Email: ${log.user_email}\n`;
      report += `Points: ${log.reward_points}\n`;
      report += `Badge: ${log.reward_badge || 'None'}\n`;
      report += `Pickups: ${log.total_pickups}\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resident_reward_logs.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reward-logs-page">
      <header className="topbar">
        <div className="nav-left">
          <button onClick={() => navigate('/admin')}>Home</button>
          <button disabled className="active-tab">Reward Logs</button>
        </div>
        <div className="nav-right">
          <button className="logout-btn" onClick={() => navigate('/')}>Log Out</button>
        </div>
      </header>

      <main className="logs-container">
        <h1>Resident Reward Logs</h1>

        {loading ? (
          <p>Loading reward logs...</p>
        ) : error ? (
          <p className="error-msg">{error}</p>
        ) : logs.length === 0 ? (
          <p className="empty-msg">No reward logs available.</p>
        ) : (
          <>
            <div className="logs-grid">
              {logs.map((log, index) => (
                <div className="log-card" key={index}>
                  <h3>{log.user_name} ({log.user_id})</h3>
                  <p><strong>Email:</strong> {log.user_email}</p>
                  <p><strong>Points:</strong> {log.reward_points}</p>
                  <p><strong>Badge:</strong> {log.reward_badge || 'None'}</p>
                  <p><strong>Pickups:</strong> {log.total_pickups}</p>
                </div>
              ))}
            </div>

            <div className="download-section">
              <button className="download-btn" onClick={handleDownloadReport}>
                ⬇️ Download Report
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default RewardLogs;
