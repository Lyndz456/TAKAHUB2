// src/pages/RewardLogs.tsx
import { useNavigate } from 'react-router-dom';
import './RewardLogs.css';

function RewardLogs() {
  const navigate = useNavigate();

  // This will later come from the backend
  const rewardLogs = [
    // Example dummy data (remove if using backend)
    { username: 'R23', email: 'resident1@example.com', points: 120, totalPickups: 3 },
    { username: 'R58', email: 'resident2@example.com', points: 200, totalPickups: 5 },
  ];

  // Simulated download logic — will later be replaced with backend PDF export
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
      {/* Top Bar */}
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

        <div className="logs-grid">
          {rewardLogs.length === 0 ? (
            <p className="empty-msg">No reward logs available. Connect to backend to display data.</p>
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
