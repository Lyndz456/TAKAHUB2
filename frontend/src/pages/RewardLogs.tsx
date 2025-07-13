// src/pages/RewardLogs.tsx
import { useNavigate } from 'react-router-dom';
import './RewardLogs.css';

function RewardLogs() {
  const navigate = useNavigate();

  const rewardLogs = [
    { username: 'R23', email: 'resident1@example.com', points: 120, totalPickups: 3 },
    { username: 'R58', email: 'resident2@example.com', points: 200, totalPickups: 5 },
  ];

  const handleDownloadReport = () => {
    let report = 'TAKAHUB - Resident Reward Summary\n\n';
    rewardLogs.forEach(log => {
      report += `Username: ${log.username}\nEmail: ${log.email}\nPoints: ${log.points}\nPickups: ${log.totalPickups}\n\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'reward_logs.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reward-logs-page">
      {/* Custom Topbar with Branding */}
      <header className="admin-navbar">
        <h2>♻️ <span className="brand-name">TAKAHUB</span></h2>
        <nav>
          <button onClick={() => navigate('/admin')}>Home</button>
          <button onClick={() => navigate('/')}>Logout</button>
        </nav>
      </header>

      <main className="logs-container">
        <h1>Resident Reward Logs</h1>

        <div className="logs-grid">
          {rewardLogs.length === 0 ? (
            <p className="empty-msg">No reward logs available.</p>
          ) : (
            rewardLogs.map((log, index) => (
              <div className="log-card" key={index}>
                <h3>{log.username}</h3>
                <p><strong>Email:</strong> {log.email}</p>
                <p><strong>Total Points:</strong> {log.points}</p>
                <p><strong>Pickups:</strong> {log.totalPickups}</p>
              </div>
            ))
          )}
        </div>

        {rewardLogs.length > 0 && (
          <div className="download-section">
            <button className="download-btn" onClick={handleDownloadReport}>
              ⬇️ Download Report
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default RewardLogs;
