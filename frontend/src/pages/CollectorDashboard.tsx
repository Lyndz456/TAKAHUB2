import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollectorDashboard.css';

interface PickupRequest {
  request_id: number;
  pickup_date: string;
  location: string;
  waste_type: string;
  status: 'pending' | 'accepted' | 'rejected';
  user_id: string;
  resident_name?: string;
  reason?: string;
}

function CollectorDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PickupRequest[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/pickup/collector', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests || []);
      })
      .catch((err) => console.error('❌ Error fetching pickups:', err));
  }, []);

  const handleAccept = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/pickup/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ request_id: id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Pickup #${id} accepted.`);
        setRequests((prev) =>
          prev.map((req) =>
            req.request_id === id ? { ...req, status: 'accepted' } : req
          )
        );
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error('❌ Accept failed:', err);
    }
  };

  const handleReject = async (id: number) => {
    const reason = rejectionReasons[id];
    if (!reason?.trim()) {
      alert('Please provide a reason before rejecting.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/pickup/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ request_id: id, reason }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`❌ Pickup #${id} rejected.`);
        setRequests((prev) =>
          prev.map((req) =>
            req.request_id === id ? { ...req, status: 'rejected', reason } : req
          )
        );
      } else {
        alert(data.message || 'Failed to reject pickup request.');
      }
    } catch (error) {
      console.error('❌ Reject failed:', error);
    }
  };

  const handleReasonChange = (id: number, reason: string) => {
    setRejectionReasons((prev) => ({ ...prev, [id]: reason }));
  };

  return (
    <div className="collector-dashboard">
      <div className="sidebar">
        <h2 className="logo">♻️ <span className="brand-name">TAKAHUB</span></h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/collector')}>🏠 Home</li>
            <li onClick={() => navigate('/collector/pickup-requests')}>📦 Pickup Requests</li>
            <li onClick={() => navigate('/collection-history')}>📜 Collection History</li>
          </ul>
        </nav>
      </div>

      <div className="main-area">
        <div className="topbar">
          <div className="topbar-left">
            <button className="home-link" onClick={() => navigate('/')}>Home</button>
          </div>
          <div className="topbar-right">
            <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
          </div>
        </div>

        <div className="welcome-box">
          <h1>Welcome Collector! 👷‍♂️</h1>
          <h3>Pending Requests: {requests.filter(r => r.status === 'pending').length}</h3>
        </div>

        <div className="requests-section">
          {requests
            .filter((req) => req.status === 'pending')
            .map((req) => (
              <div key={req.request_id} className="request-card fade-in">
                <div className="request-details">
                  <p><strong>📦 Request #:</strong> {req.request_id}</p>
                  <p><strong>📅 Date:</strong> {req.pickup_date}</p>
                  <p><strong>📍 Location:</strong> {req.location}</p>
                  <p><strong>♻️ Waste:</strong> {req.waste_type}</p>
                  <p><strong>👤 Resident:</strong> {req.resident_name || '(unknown)'}</p>
                </div>

                <div className="action-section">
                  <button className="accept" onClick={() => handleAccept(req.request_id)}>✅ Accept</button>
                  <button className="reject" onClick={() => handleReject(req.request_id)}>❌ Reject</button>
                  <input
                    type="text"
                    placeholder="Reason for rejection"
                    value={rejectionReasons[req.request_id] || ''}
                    onChange={(e) => handleReasonChange(req.request_id, e.target.value)}
                    className="reason-input"
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default CollectorDashboard;
