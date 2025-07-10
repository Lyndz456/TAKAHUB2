import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PickupRequest.css';

interface WasteEntry {
  request_id: number;
  user_id: string;
  pickup_date: string;
  location: string;
  status: string;
  collected: boolean;
  plastic: number;
  organic: number;
  metal: number;
  ewaste: number;
  resident_name?: string;
}

function PickupRequests() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<WasteEntry[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/pickup/collector', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        const accepted = data.requests.filter((r: any) => r.status === 'accepted');
        const formatted = accepted.map((r: any) => ({
          ...r,
          collected: false,
          plastic: 0,
          organic: 0,
          metal: 0,
          ewaste: 0,
        }));
        setEntries(formatted);
      })
      .catch(err => console.error('Error loading pickups:', err));
  }, []);

  const handleChange = (id: number, field: keyof WasteEntry, value: number) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.request_id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const markAsCollected = (id: number) => {
    setEntries(prev =>
      prev.map(entry =>
        entry.request_id === id ? { ...entry, collected: true } : entry
      )
    );
  };

  const handleSubmit = async (entry: WasteEntry) => {
    const token = localStorage.getItem('token');
    const hazardous = entry.metal + entry.ewaste;

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
        notes: 'Marked collected and submitted by collector',
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert(`✅ Waste submitted.\n+${data.reward_points_earned} pts\n🏅 Badge: ${data.badge_awarded || 'None'}`);
      setEntries(prev => prev.filter(e => e.request_id !== entry.request_id));
    } else {
      alert(`❌ ${data.message || data.error}`);
    }
  };

  return (
    <div className="pickup-requests-wrapper">
      <header className="topbar">
        <h2>Accepted Pickup Requests</h2>
        <button onClick={() => navigate('/collector')}>⬅ Back</button>
      </header>

      {entries.length === 0 ? (
        <p>No accepted requests available.</p>
      ) : (
        entries.map(entry => (
          <div key={entry.request_id} className="pickup-card">
            <h3>Request #{entry.request_id}</h3>
            <p><strong>Resident:</strong> {entry.resident_name || '(unknown)'}</p>
            <p><strong>Date:</strong> {entry.pickup_date}</p>
            <p><strong>Location:</strong> {entry.location}</p>

            {!entry.collected ? (
              <button className="mark-collected-btn" onClick={() => markAsCollected(entry.request_id)}>
                🚛 Mark as Collected
              </button>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(entry);
                }}
              >
                <label>Plastic (kg):</label>
                <input
                  type="number"
                  min="0"
                  value={entry.plastic}
                  onChange={(e) => handleChange(entry.request_id, 'plastic', Number(e.target.value))}
                />

                <label>Organic (kg):</label>
                <input
                  type="number"
                  min="0"
                  value={entry.organic}
                  onChange={(e) => handleChange(entry.request_id, 'organic', Number(e.target.value))}
                />

                <label>Metal (kg):</label>
                <input
                  type="number"
                  min="0"
                  value={entry.metal}
                  onChange={(e) => handleChange(entry.request_id, 'metal', Number(e.target.value))}
                />

                <label>E-Waste (kg):</label>
                <input
                  type="number"
                  min="0"
                  value={entry.ewaste}
                  onChange={(e) => handleChange(entry.request_id, 'ewaste', Number(e.target.value))}
                />

                <button type="submit" className="submit-btn">📤 Submit Waste</button>
              </form>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default PickupRequests;
