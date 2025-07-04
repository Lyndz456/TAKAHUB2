// src/pages/PickupRequests.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { pickupRequests } from '../data/pickupData'; // Simulated shared data
import { useUser } from '../context/UserContext';
import './PickupRequest.css';

interface WasteEntry {
  request_id: number;
  pickup_date: string;
  location: string;
  organic: number;
  plastic: number;
  metal: number;
  ewaste: number;
}

function PickupRequests() {
  const navigate = useNavigate();
  const { logout } = useUser();
  const [entries, setEntries] = useState<WasteEntry[]>([]);

  useEffect(() => {
    // Filter accepted requests only
    const acceptedEntries = pickupRequests
      .filter((req) => req.status === 'accepted')
      .map((req) => ({
        request_id: req.request_id,
        pickup_date: req.pickup_date,
        location: req.location,
        organic: 0,
        plastic: 0,
        metal: 0,
        ewaste: 0,
      }));
    setEntries(acceptedEntries);
  }, []);

  const handleChange = (
    id: number,
    field: keyof WasteEntry,
    value: number
  ) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.request_id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleSubmit = (id: number) => {
    const entry = entries.find((e) => e.request_id === id);
    if (entry) {
      console.log('Submitted:', entry);
      alert(`Waste data submitted for Request #${id}`);
      // Future: Send to backend
    }
  };

  return (
    <div className="pickup-requests-wrapper">
      {/* Topbar */}
      <header className="topbar">
        <div className="nav-left">
          <button onClick={() => navigate('/collector')}> Home</button>
          <span className="active-tab">Pickup Requests</span>
        </div>
        <div className="nav-right">
          <button className="logout-btn" onClick={() => { logout(); navigate('/'); }}>
            Logout
          </button>
        </div>
      </header>

      <main className="pickup-requests-page">
        <h2>Accepted Pickup Requests</h2>

        {entries.length === 0 ? (
          <p className="no-entries-msg">No accepted requests available.</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.request_id} className="pickup-card">
              <h3>Request #{entry.request_id}</h3>
              <p><strong>Location:</strong> {entry.location}</p>
              <p><strong>Date:</strong> {entry.pickup_date}</p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(entry.request_id);
                }}
              >
                <label>Organic Waste (kg):</label>
                <input
                  type="number"
                  min="0"
                  value={entry.organic}
                  onChange={(e) =>
                    handleChange(entry.request_id, 'organic', Number(e.target.value))
                  }
                />

                <label>Plastic Waste (kg):</label>
                <input
                  type="number"
                  min="0"
                  value={entry.plastic}
                  onChange={(e) =>
                    handleChange(entry.request_id, 'plastic', Number(e.target.value))
                  }
                />

                <label>Metal Waste (kg):</label>
                <input
                  type="number"
                  min="0"
                  value={entry.metal}
                  onChange={(e) =>
                    handleChange(entry.request_id, 'metal', Number(e.target.value))
                  }
                />

                <label>E-Waste (kg):</label>
                <input
                  type="number"
                  min="0"
                  value={entry.ewaste}
                  onChange={(e) =>
                    handleChange(entry.request_id, 'ewaste', Number(e.target.value))
                  }
                />

                <button type="submit" className="submit-btn">
                  Submit Waste Data
                </button>
              </form>
            </div>
          ))
        )}
      </main>
    </div>
  );
}

export default PickupRequests;
