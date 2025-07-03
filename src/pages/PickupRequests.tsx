// src/pages/PickupRequests.tsx
import { useState, useEffect } from 'react';
import { pickupRequests } from '../data/pickupData';
import './PickupRequest.css';

// Interface for local form data
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
  const [entries, setEntries] = useState<WasteEntry[]>([]);

  // Load accepted requests and map to editable form structure
  useEffect(() => {
    const acceptedEntries = pickupRequests
      .filter((req) => req.status === 'accepted') // ✅ Make sure your data has status field!
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

  // Handle field changes for specific request
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

  // Simulate submitting data for a request
  const handleSubmit = (id: number) => {
    const entry = entries.find((e) => e.request_id === id);
    if (entry) {
      console.log('✅ Waste data submitted:', entry);
      alert(`Waste data submitted for Request #${id}`);
      // 🔗 TODO: Send this to backend or save it globally
    }
  };

  return (
    <div className="pickup-requests-page">
      <h2>Accepted Pickup Requests</h2>
      {entries.length === 0 ? (
        <p>No accepted requests available.</p>
      ) : (
        entries.map((entry) => (
          <div key={entry.request_id} className="pickup-card">
            <h3>Request #{entry.request_id}</h3>
            <p><strong>Location:</strong> {entry.location}</p>
            <p><strong>Date:</strong> {entry.pickup_date}</p>

            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(entry.request_id); }}>
              <label>Organic Waste (kg):</label>
              <input
                type="number"
                value={entry.organic}
                onChange={(e) => handleChange(entry.request_id, 'organic', Number(e.target.value))}
                min="0"
              />

              <label>Plastic Waste (kg):</label>
              <input
                type="number"
                value={entry.plastic}
                onChange={(e) => handleChange(entry.request_id, 'plastic', Number(e.target.value))}
                min="0"
              />

              <label>Metal Waste (kg):</label>
              <input
                type="number"
                value={entry.metal}
                onChange={(e) => handleChange(entry.request_id, 'metal', Number(e.target.value))}
                min="0"
              />

              <label>E-Waste (kg):</label>
              <input
                type="number"
                value={entry.ewaste}
                onChange={(e) => handleChange(entry.request_id, 'ewaste', Number(e.target.value))}
                min="0"
              />

              <button type="submit">Submit Data</button>
            </form>
          </div>
        ))
      )}
    </div>
  );
}

export default PickupRequests;
