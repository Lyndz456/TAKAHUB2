// src/pages/ViewIllegalDumpsites.tsx
import { useNavigate } from 'react-router-dom';
import './ViewIllegalDumpsites.css';
// import { useEffect, useState } from 'react';

function ViewIllegalDumpsites() {
  const navigate = useNavigate();

  // -----------------------------
  // 🔒 Backend fetch placeholder
  // Uncomment and configure this block when backend is ready
  /*
  const [dumpsites, setDumpsites] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/dumpsites') // Replace with actual endpoint
      .then((res) => res.json())
      .then((data) => setDumpsites(data))
      .catch((err) => console.error('Error fetching dumpsites:', err));
  }, []);
  */

  // Temporary dummy data or empty placeholder
  const dumpsites: any[] = [];

  return (
    <div className="admin-dumpsite-page">
      {/* Top Bar */}
      <header className="topbar">
        <div className="nav-left">
          <button onClick={() => navigate('/admin')}>Home</button>
          <button disabled className="active-tab">Illegal Dumpsites</button>
        </div>
        <div className="nav-right">
          <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dumpsite-content">
        <h1>Reported Illegal Dumpsites</h1>

        <div className="dumpsite-grid">
          {dumpsites.length === 0 ? (
            <p>No reports available. Connect to backend to load data.</p>
          ) : (
            dumpsites.map((site: any) => (
              <div key={site.report_id} className="dumpsite-card">
                <h3>📍 {site.report_location}</h3>
                <p><strong>Description:</strong> {site.report_description || 'No description provided.'}</p>
                <p><strong>Reported:</strong> {new Date(site.reported_at).toLocaleString()}</p>
                <p><strong>Reported By:</strong> User #{site.user_id}</p>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default ViewIllegalDumpsites;
