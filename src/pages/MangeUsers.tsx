// src/pages/ManageUsers.tsx
import { useState } from 'react';
import './ManageUsers.css';

function ManageUsers() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'resident',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - will connect to backend
    console.log('New user to be created:', formData);
    alert(`User (${formData.role}) created successfully.`);
    setFormData({ name: '', email: '', role: 'resident' });
  };

  return (
    <div className="manage-users-page">
      <header className="topbar">
        <h2>Manage Users</h2>
      </header>

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
              <option value="municipal">Municipal Authority</option>
            </select>
            <button type="submit">Add User</button>
          </form>
        </section>

        <section className="user-list-section">
          <h3>All Users (Coming Soon)</h3>
          <p>This section will show all users grouped by role once backend is connected.</p>
        </section>
      </main>
    </div>
  );
}

export default ManageUsers;
