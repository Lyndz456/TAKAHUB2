// src/pages/BookPickup.tsx
import { useState } from 'react';
import { pickupRequests } from '../data/pickupData';
import './BookPickup.css';

function BookPickup() {
  const [pickupData, setPickupData] = useState({
    date: '',
    location: '',
    wasteTypes: [] as string[],
  });

  const [confirmation, setConfirmation] = useState('');
  const [pickupId, setPickupId] = useState<number | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = Math.floor(Math.random() * 9000 + 1000);
    setPickupId(newId);

    pickupRequests.push({
      request_id: newId,
      pickup_date: pickupData.date,
      location: pickupData.location,
      waste_type: pickupData.wasteTypes.join(', '), // join multiple types
      status: 'pending',
    });

    setConfirmation(`Pickup request submitted! Your ID is #${newId}`);
    console.log('Pickup Submitted:', {
      request_id: newId,
      ...pickupData,
    });

    setPickupData({ date: '', location: '', wasteTypes: [] });
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

        <button type="submit">Submit Request</button>
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
