import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './BookPickup.css';

interface Pickup {
  request_id: number;
  pickup_date: string;
  location: string;
  waste_type: string;
  status: string;
}

function BookPickup() {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="pickup-page">
      {/* Top Navigation */}
      <header className="pickup-navbar">
        <h2>♻️ TAKAHUB</h2>
        <nav>
          <button onClick={() => navigate('/resident')}> Home</button>
          <button onClick={handleLogout}> Log Out</button>
        </nav>
      </header>

      <motion.div
        className="pickup-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Form Section */}
        <div className="pickup-form-section">
          <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }}>📦 Book a Pickup</motion.h1>
          <form className="pickup-form" onSubmit={handleSubmit}>
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

            {confirmation && <p className="confirmation">{confirmation}</p>}
          </form>
        </div>

        {/* Request History Section */}
        <div className="pickup-history-section">
          <h2>📋 My Pickup Requests</h2>
          {existingRequests.length === 0 ? (
            <p>No pickups yet.</p>
          ) : (
            <ul>
              {existingRequests.map((req) => (
                <li key={req.request_id}>
                  <strong>Date:</strong> {req.pickup_date} | <strong>Location:</strong> {req.location} <br />
                  <strong>Type:</strong> {req.waste_type} | <strong>Status:</strong> {req.status}
                  {req.status === 'pending' && (
                    <div className="action-btns">
                      <button onClick={() => handleEdit(req)}>Edit</button>
                      <button onClick={() => handleDelete(req.request_id)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default BookPickup;
