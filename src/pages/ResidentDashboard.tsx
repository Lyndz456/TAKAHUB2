import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { pickupRequests } from '../data/pickupData';
import './ResidentDashboard.css';

function ResidentDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useUser();

  // Filter requests that belong to this resident
  const myRequests = pickupRequests.filter(req => req.user_id === user?.username);
  const latestRequest = myRequests[myRequests.length - 1];

  return (
    <div className="resident-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">♻️</div>
        <nav>
          <ul>
            <li onClick={() => navigate('/resident')}>Dashboard</li>
            <li onClick={() => navigate('/book-pickup')}>Pickups</li>
            <li onClick={() => navigate('/sorting-guide')}>Sorting Guide</li>
          </ul>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="main-content">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="nav-left">
            <button onClick={() => navigate('/resident')}>Home</button>
            <button onClick={() => navigate('/book-pickup')}>Book Pickup</button>
            <button onClick={() => navigate('/rewards')}>Rewards</button>
          </div>
          <div className="nav-right">
            <button className="logout-btn" onClick={logout}>Log Out</button>
          </div>
        </header>

        {/* Welcome Section */}
        <section className="dashboard-body">
          <h1>WELCOME!!</h1>
          <div className="stats-box">
            <p>Points: <strong>120</strong></p>
            <p>Pickups: <strong>{myRequests.length}</strong></p>
            <p>Badges: <strong>3</strong></p>
          </div>

          {latestRequest ? (
            <div className="pickup-info">
              <p><strong>Next Pickup:</strong> {latestRequest.pickup_date}</p>
              <p><strong>Location:</strong> {latestRequest.location}</p>
              <p><strong>Status:</strong> {
                latestRequest.status === 'accepted' ? '✅ Accepted' :
                latestRequest.status === 'rejected' ? `❌ Rejected - ${latestRequest.reason}` :
                '⏳ Pending'
              }</p>
            </div>
          ) : (
            <p style={{ marginTop: '1rem' }}><em>No pickup requests yet.</em></p>
          )}

          <div className="dashboard-buttons">
            <button className="cta-btn" onClick={() => navigate('/sorting-guide')}>
              How to sort waste
            </button>

            <button className="cta-btn" onClick={() => navigate('/report-dumpsite')}>
              Report Illegal Dumpsites
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ResidentDashboard;
