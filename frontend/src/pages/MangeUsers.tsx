import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageUsers.css';

function ManageUsers() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'resident',
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('⚠️ You must be logged in as admin to perform this action.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${data.message}`);
        setFormData({ name: '', email: '', role: 'resident' });
      } else {
        setMessage(`❌ ${data.message || data.error}`);
      }
    } catch (err) {
      console.error('Add user error:', err);
      setMessage('❌ Failed to connect to server.');
    }

    setLoading(false);
  };

  return (
    <div className="manage-users-page">
      <div className="admin-navbar">
        <h2>♻️ TAKAHUB</h2>
        <nav>
          <button onClick={() => navigate('/admin')}>Home</button>
          <button onClick={() => navigate('/')}>Logout</button>
        </nav>
      </div>

      <main className="user-container">
        <section className="user-form-section">
          <h3>Add New User</h3>
          <form onSubmit={handleSubmit} className="user-form">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="resident">Resident</option>
              <option value="collector">Collector</option>
              <option value="municipal authority">Municipal Authority</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Add User'}
            </button>
          </form>

          {message && <p className="confirmation-msg">{message}</p>}
        </section>

        <section className="summary-section">
  <h3>📊 User Roles Summary</h3>
  <ul>
    <li>🧍 Resident – Can book pickups, earn rewards</li>
    <li>🚛 Collector – Accepts and manages pickups</li>
    <li>🏙️ Municipal Authority – Reviews dumpsite reports</li>
    <li>🛠️ Admin – Manages users and system</li>
  </ul>
</section>

<section className="tips-section">
  <h3>💡 Admin Tips</h3>
  <p>✔ Fill in the full name and email.</p>
  <p>✔ Select the appropriate role for the user.</p>
  <p>✔ After creation, credentials will be auto-sent (if email enabled).</p>
</section>

      </main>
    </div>
  );
}

export default ManageUsers;
