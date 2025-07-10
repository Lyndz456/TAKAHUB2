// src/pages/ReportDumpsite.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReportDumpsite.css';

function ReportDumpsite() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    location: '',
    description: '',
  });

  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setConfirmation('');

    const token = localStorage.getItem('token');
    if (!token) {
      setConfirmation('⚠️ You must be logged in to report a dumpsite.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/reports/illegal-dumpsite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          report_location: formData.location,
          report_description: formData.description,
          image_url: null, // Image upload removed
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setConfirmation('✅ Dumpsite reported successfully!');
        setFormData({ location: '', description: '' });
      } else {
        setConfirmation(`❌ ${data.message || data.error}`);
      }
    } catch (err) {
      console.error('Report error:', err);
      setConfirmation('❌ Unexpected error. Try again.');
    }

    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="report-page">
      {/* Navigation Bar */}
      <header className="report-navbar">
        <h2>♻️ TAKAHUB</h2>
        <nav>
          <button onClick={() => navigate('/resident')}>Home</button>
          <button onClick={handleLogout}>Log Out</button>
        </nav>
      </header>

      {/* Main Form */}
      <div className="report-wrapper">
        <h1 className="slide-down">🗑️ Report Illegal Dumpsite</h1>
        <p className="fade-in">
          Help keep your community clean by reporting a dumpsite in your area.
        </p>

        <form className="report-form slide-in" onSubmit={handleSubmit}>
          <label htmlFor="location">Location:</label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g. Kibera Sector 6"
          />

          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
            placeholder="e.g. Large trash pile near the road..."
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>

          {confirmation && (
            <p className="confirmation-message fade-in">{confirmation}</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default ReportDumpsite;
