// src/pages/BookPickup.tsx
import { useState } from 'react';
import './BookPickup.css';

function BookPickup() {
  const [pickupData, setPickupData] = useState({
    date: '',
    location: '',
    wasteTypes: [] as string[],
  });

  const [confirmation, setConfirmation] = useState('');
  const [pickupId, setPickupId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupData({
      ...pickupData,
      [e.target.name]: e.target.value,
    });
  };

  const handleWasteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setPickupData((prev) => {
      const updated = checked
        ? [...prev.wasteTypes, value]
        : prev.wasteTypes.filter((type) => type !== value);
      return { ...prev, wasteTypes: updated };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setConfirmation('');

    try {
      const token = localStorage.getItem('token'); // Ensure token is stored at login

      if (!token) {
        setConfirmation('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/pickup/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickup_date: pickupData.date,
          location: pickupData.location,
          waste_type: pickupData.wasteTypes.join(', '),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPickupId(data.request.request_id);
        setConfirmation(`✅ Pickup request submitted! Your ID is #${data.request.request_id}`);
        setPickupData({ date: '', location: '', wasteTypes: [] });
      } else {
        setConfirmation(`❌ ${data.message || 'Pickup request failed.'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setConfirmation('❌ An unexpected error occurred. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="pickup-wrapper">
      <div className="pickup-banner">
        <h1 className="slide-down">📦 Book a Pickup</h1>
        <p className="fade-in">Sort your waste, book your pickup, and earn points!</p>
      </div>

      <form className="pickup-form slide-in" onSubmit={handleSubmit}>
        <label>Pickup Date:</label>
        <input
          type="date"
          name="date"
          value={pickupData.date}
          onChange={handleChange}
          required
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          placeholder="e.g., Umoja 1, Block 5"
          value={pickupData.location}
          onChange={handleChange}
          required
        />

        <label>Select Waste Types:</label>
        <div className="checkbox-group">
          {['organic', 'plastic', 'metal', 'e-waste', 'mixed'].map((type) => (
            <label key={type}>
              <input
                type="checkbox"
                value={type}
                checked={pickupData.wasteTypes.includes(type)}
                onChange={handleWasteChange}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>

        {confirmation && <p className="confirmation fade-in">{confirmation}</p>}
      </form>

      <footer className="pickup-footer fade-in">
        <h3>♻️ Turn Trash Into Treasure!</h3>
        <p>Every pickup you book earns you reward points 🌟.</p>
        <p>Track your points, redeem them, and contribute to a cleaner community.</p>
      </footer>
    </div>
  );
}

export default BookPickup;
