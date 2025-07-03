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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Report Submitted:', formData);

    // Simulate storage of dummy URL
    const dummyImageUrl = previewUrl || 'https://dummyimage.com/300x200';

    setConfirmation(`Dumpsite reported successfully! Thank you for keeping your community clean.`);

    // Reset form
    setFormData({ location: '', description: '', image: null });
    setPreviewUrl(null);
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
        />

        <label>Upload Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />

        {previewUrl && (
          <div className="image-preview fade-in">
            <p>Preview:</p>
            <img src={previewUrl} alt="Preview" />
          </div>
        )}

        <button type="submit">Submit Report</button>

        {confirmation && <p className="confirmation-message fade-in">{confirmation}</p>}
      </form>
    </div>
  );
}

export default ReportDumpsite;
