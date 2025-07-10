// src/pages/BookPickup.tsx
import { useEffect, useState } from 'react';
import './BookPickup.css';

interface Pickup {
  request_id: number;
  pickup_date: string;
  location: string;
  waste_type: string;
  status: string;
}

function BookPickup() {
  const [pickupData, setPickupData] = useState({
    date: '',
    location: '',
    wasteTypes: [] as string[],
  });

  const [existingRequests, setExistingRequests] = useState<Pickup[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const fetchRequests = async () => {
    if (!token) return;
    const res = await fetch('http://localhost:5000/api/pickup/my-requests', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setExistingRequests(data.requests || []);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

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

    const body = {
      pickup_date: pickupData.date,
      location: pickupData.location,
      waste_type: pickupData.wasteTypes.join(', '),
    };

    const url = editingId
      ? `http://localhost:5000/api/pickup/update/${editingId}`
      : 'http://localhost:5000/api/pickup/submit';

    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setConfirmation(`✅ ${editingId ? 'Pickup updated' : 'Pickup submitted'} successfully`);
        setPickupData({ date: '', location: '', wasteTypes: [] });
        setEditingId(null);
        fetchRequests();
      } else {
        setConfirmation(`❌ ${data.message || 'Failed'}`);
      }
    } catch (error) {
      setConfirmation('❌ Server error');
    }

    setLoading(false);
  };

  const handleEdit = (req: Pickup) => {
    setPickupData({
      date: req.pickup_date,
      location: req.location,
      wasteTypes: req.waste_type.split(',').map((w) => w.trim()),
    });
    setEditingId(req.request_id);
    setConfirmation(`Editing request #${req.request_id}`);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    const res = await fetch(`http://localhost:5000/api/pickup/delete/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setConfirmation(`🗑️ Request #${id} deleted`);
      fetchRequests();
    } else {
      setConfirmation(`❌ ${data.message}`);
    }
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
          {loading ? 'Processing...' : editingId ? 'Update Request' : 'Submit Request'}
        </button>

        {confirmation && <p className="confirmation fade-in">{confirmation}</p>}
      </form>

      <section className="pickup-history fade-in">
        <h2>📋 My Pickup Requests</h2>
        {existingRequests.length === 0 ? (
          <p>No pickups yet.</p>
        ) : (
          <ul>
            {existingRequests.map((req) => (
              <li key={req.request_id}>
                <strong>Date:</strong> {req.pickup_date} | <strong>Location:</strong> {req.location} | <strong>Type:</strong> {req.waste_type} | <strong>Status:</strong> {req.status}
                {req.status === 'pending' && (
                  <>
                    <button className="edit-btn" onClick={() => handleEdit(req)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(req.request_id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default BookPickup;
