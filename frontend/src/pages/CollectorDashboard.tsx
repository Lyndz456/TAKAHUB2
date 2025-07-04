import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pickupRequests as sharedRequests } from '../data/pickupData'; // Import shared simulated data
import './CollectorDashboard.css';

// Define the request interface including optional rejection reason
interface PickupRequest {
  request_id: number;
  pickup_date: string;
  location: string;
  waste_type: string;
  status: 'pending' | 'accepted' | 'rejected';
  reason?: string;
}

function CollectorDashboard() {
  const navigate = useNavigate();

  // Initialize state with shared pickup requests from simulation file
  const [requests, setRequests] = useState<PickupRequest[]>(
    sharedRequests.map((req) => ({ ...req, status: 'pending' }))
  );

  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({});

  // Mark a request as accepted
  const handleAccept = (id: number) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.request_id === id ? { ...req, status: 'accepted' } : req
      )
    );
  };

  // Mark a request as rejected if a reason is provided
  const handleReject = (id: number) => {
    if (!rejectionReasons[id]?.trim()) {
      alert('Please provide a reason before rejecting.');
      return;
    }

    setRequests((prev) =>
      prev.map((req) =>
        req.request_id === id
          ? { ...req, status: 'rejected', reason: rejectionReasons[id] }
          : req
      )
    );
  };

  // Track changes to the rejection reason input field
  const handleReasonChange = (id: number, reason: string) => {
    setRejectionReasons((prev) => ({ ...prev, [id]: reason }));
  };

  return (
    <div className="collector-dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">♻️ </h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/collector')}>Dashboard</li>
            <li onClick={() => navigate('/collector/pickup-requests')}>Pickup Requests</li>
            <li onClick={() => navigate('/collection-history')}>Collection History</li>
          </ul>
        </nav>
      </div>

      {/* Main Area */}
      <div className="main-area">
        {/* Topbar */}
        <div className="topbar">
          <span className="topbar-title">Collector Dashboard</span>
          <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
        </div>

        {/* Welcome Box */}
        <div className="welcome-box">
          <h1>WELCOME!!</h1>
          <h3>TODAY’S REQUESTS: {requests.filter(r => r.status === 'pending').length}</h3>
        </div>

        {/* Requests Section */}
        <div className="requests-section">
          {requests.filter(req => req.status === 'pending').map((req) => (
            <div key={req.request_id} className="request-card">
              <p><strong>Request ID:</strong> #{req.request_id}</p>
              <p><strong>Date:</strong> {req.pickup_date}</p>
              <p><strong>Location:</strong> {req.location}</p>
              <p><strong>Waste Type:</strong> {req.waste_type}</p>

              <div className="btn-group">
                <button className="accept" onClick={() => handleAccept(req.request_id)}>
                  ACCEPT
                </button>
                <button className="reject" onClick={() => handleReject(req.request_id)}>
                  REJECT
                </button>
              </div>

              <input
                type="text"
                placeholder="Enter rejection reason..."
                value={rejectionReasons[req.request_id] || ''}
                onChange={(e) => handleReasonChange(req.request_id, e.target.value)}
                className="reason-input"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollectorDashboard;
