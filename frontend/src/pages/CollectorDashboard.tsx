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
        const pending = data.requests.filter((r: any) => r.status === 'pending');
        setRequests(pending || []);
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
        setRequests((prev) => prev.filter((req) => req.request_id !== id));
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error('❌ Accept failed:', err);
      alert('Failed to accept pickup');
    }
  };

  const handleReject = (id: number) => {
    if (!rejectionReasons[id]?.trim()) {
      alert('Please provide a reason before rejecting.');
      return;
    }

    // Ideally you also send this to backend, but here we're just removing
    setRequests((prev) =>
      prev.map((req) =>
        req.request_id === id
          ? { ...req, status: 'rejected', reason: rejectionReasons[id] }
          : req
      )
    );
  };

  const handleReasonChange = (id: number, reason: string) => {
    setRejectionReasons((prev) => ({ ...prev, [id]: reason }));
  };

  return (
    <div className="collector-dashboard">
      <div className="sidebar">
        <h2 className="logo">♻️</h2>
        <nav>
          <ul>
            <li onClick={() => navigate('/collector')}>Dashboard</li>
            <li onClick={() => navigate('/collector/pickup-requests')}>Pickup Requests</li>
            <li onClick={() => navigate('/collection-history')}>Collection History</li>
          </ul>
        </nav>
      </div>

      <div className="main-area">
        <div className="topbar">
          <span className="topbar-title">Collector Dashboard</span>
          <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
        </div>

        <div className="welcome-box">
          <h1>WELCOME!!</h1>
          <h3>TODAY’S REQUESTS: {requests.length}</h3>
        </div>

        <div className="requests-section">
          {requests.map((req) => (
            <div key={req.request_id} className="request-card">
              <p><strong>Request ID:</strong> #{req.request_id}</p>
              <p><strong>Date:</strong> {req.pickup_date}</p>
              <p><strong>Location:</strong> {req.location}</p>
              <p><strong>Waste Type:</strong> {req.waste_type}</p>
              <p><strong>Resident:</strong> {req.resident_name || '(unknown)'}</p>

              <div className="btn-group">
                <button className="accept" onClick={() => handleAccept(req.request_id)}>
                  ✅ Accept
                </button>
                <button className="reject" onClick={() => handleReject(req.request_id)}>
                  ❌ Reject
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
