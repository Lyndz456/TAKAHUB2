import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollectorDashboard.css';

interface PickupRequest {
  request_id: number;
  pickup_date: string;
  location: string;
  waste_type: string;
  status: 'pending' | 'accepted' | 'completed';
  user_id: string;
  resident_name?: string;
  reason?: string;
}

interface WasteEntry extends PickupRequest {
  plastic: number;
  organic: number;
  metal: number;
  ewaste: number;
}

function CollectorDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<WasteEntry[]>([]);
  const [rejectionReasons, setRejectionReasons] = useState<{ [key: number]: string }>({});

  const fetchRequests = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/pickup/collector', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const withWeights = data.requests.map((r: PickupRequest) => ({
          ...r,
          plastic: 0,
          organic: 0,
          metal: 0,
          ewaste: 0,
        }));
        setRequests(withWeights);
      })
      .catch((err) => console.error('❌ Error fetching pickups:', err));
  };

  useEffect(() => {
    fetchRequests();
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
        fetchRequests();
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (err) {
      console.error('❌ Accept failed:', err);
      alert('Failed to accept pickup');
    }
  };

  const handleSubmitWaste = async (entry: WasteEntry) => {
    const token = localStorage.getItem('token');
    const hazardous = entry.metal + entry.ewaste;

    try {
      const res = await fetch('http://localhost:5000/api/waste/sort', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: entry.user_id,
          request_id: entry.request_id,
          date_sorted: entry.pickup_date,
          plastic_weight: entry.plastic,
          organic_weight: entry.organic,
          hazardous_weight: hazardous,
          notes: 'Sorted by collector',
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`✅ Submitted. +${data.reward_points_earned} pts → Badge: ${data.badge_awarded || 'None'}`);
        fetchRequests();
      } else {
        alert(`❌ ${data.message || data.error}`);
      }
    } catch (err) {
      console.error('❌ Waste submit failed:', err);
      alert('Error submitting waste');
    }
  };

  const handleChange = (id: number, field: keyof WasteEntry, value: number) => {
    setRequests(prev =>
      prev.map(req =>
        req.request_id === id ? { ...req, [field]: value } : req
      )
    );
  };

  const handleReject = (id: number) => {
    if (!rejectionReasons[id]?.trim()) {
      alert('Please provide a reason before rejecting.');
      return;
    }

    setRequests(prev =>
      prev.map(req =>
        req.request_id === id
          ? { ...req, status: 'rejected', reason: rejectionReasons[id] }
          : req
      )
    );
  };

  const handleReasonChange = (id: number, reason: string) => {
    setRejectionReasons(prev => ({ ...prev, [id]: reason }));
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
          <h3>TODAY’S REQUESTS: {requests.filter(r => r.status === 'pending').length}</h3>
        </div>

        <div className="requests-section">
          {requests.map((req) => (
            <div key={req.request_id} className="request-card">
              <p><strong>Request ID:</strong> #{req.request_id}</p>
              <p><strong>Date:</strong> {req.pickup_date}</p>
              <p><strong>Location:</strong> {req.location}</p>
              <p><strong>Waste Type:</strong> {req.waste_type}</p>
              <p><strong>Resident:</strong> {req.resident_name || '(unknown)'}</p>

              {req.status === 'pending' && (
                <>
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
                </>
              )}

              {req.status === 'accepted' && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitWaste(req);
                  }}
                >
                  <label>Plastic (kg):</label>
                  <input
                    type="number"
                    min="0"
                    value={req.plastic}
                    onChange={(e) => handleChange(req.request_id, 'plastic', Number(e.target.value))}
                  />
                  <label>Organic (kg):</label>
                  <input
                    type="number"
                    min="0"
                    value={req.organic}
                    onChange={(e) => handleChange(req.request_id, 'organic', Number(e.target.value))}
                  />
                  <label>Metal (kg):</label>
                  <input
                    type="number"
                    min="0"
                    value={req.metal}
                    onChange={(e) => handleChange(req.request_id, 'metal', Number(e.target.value))}
                  />
                  <label>E-Waste (kg):</label>
                  <input
                    type="number"
                    min="0"
                    value={req.ewaste}
                    onChange={(e) => handleChange(req.request_id, 'ewaste', Number(e.target.value))}
                  />
                  <button type="submit">📤 Submit Waste</button>
                </form>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CollectorDashboard;
