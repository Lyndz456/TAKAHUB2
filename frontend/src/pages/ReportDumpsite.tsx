import { useState } from 'react';
import './ReportDumpsite.css';

function ReportDumpsite() {
  const [formData, setFormData] = useState({ location: '', description: '' });
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setConfirmation('');

    const token = localStorage.getItem('token');
    if (!token) {
      setConfirmation('⚠️ You must be logged in to report a dumpsite.');
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

  return (
    <div className="report-wrapper">
      <h1>🗑️ Report Illegal Dumpsite</h1>
      <form onSubmit={handleSubmit} className="report-form">
        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>

        {confirmation && <p className="confirmation-message">{confirmation}</p>}
      </form>
    </div>
  );
}

export default ReportDumpsite;
