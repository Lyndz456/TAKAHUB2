// src/pages/ReportDumpsite.tsx
import { useState } from 'react';
import './ReportDumpsite.css';

function ReportDumpsite() {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    image: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
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
    const form = new FormData();
    form.append('report_location', formData.location);
    form.append('report_description', formData.description);
    if (formData.image) {
      form.append('image', formData.image);
    }

    const res = await fetch('http://localhost:5000/api/report/illegal-dumpsite', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}` // ✅ Do not manually set Content-Type
      },
      body: form,
    });

    const data = await res.json();

    if (res.ok) {
      setConfirmation('✅ Dumpsite reported successfully! Thank you for your effort.');
      setFormData({ location: '', description: '', image: null });
      setPreviewUrl(null);
    } else {
      setConfirmation(`❌ Failed to report: ${data.message || data.error}`);
    }
  } catch (err) {
    console.error('Report error:', err);
    setConfirmation('❌ Unexpected error. Try again.');
  }

  setLoading(false);
};


  return (
    <div className="report-wrapper">
      <h1 className="slide-down">🗑️ Report Illegal Dumpsite</h1>
      <p className="fade-in">
        Help keep your community clean! Fill in the details below and attach a photo.
      </p>

      <form className="report-form slide-in" onSubmit={handleSubmit}>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe the dump site..."
          required
        />

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {previewUrl && (
          <div className="image-preview fade-in">
            <p>Preview:</p>
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>

        {confirmation && (
          <p className="confirmation-message fade-in">{confirmation}</p>
        )}
      </form>
    </div>
  );
}

export default ReportDumpsite;
