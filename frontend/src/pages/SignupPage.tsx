import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // simulate a successful signup (replace later with real backend)
    const fakeUsername = 'R' + Math.floor(Math.random() * 100 + 1);
    setMessage(`Signup successful! Your username is ${fakeUsername}`);
    setTimeout(() => navigate("/"), 3000);
  };

  return (
    <div className="signup-container">
      <form className="signup-form slide-up" onSubmit={handleSubmit}>
        <h2>Create Your TAKAHUB Account</h2>

        <input
          name="name"
          type="text"
          placeholder="Full Name"
          required
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          required
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          onChange={handleChange}
        />
         <input
          name="role"
          type="role"
          placeholder="Role:(Resident)"
          required
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>

        {message && <p className="signup-message">{message}</p>}
      </form>
    </div>
  );
}

export default SignupPage;
