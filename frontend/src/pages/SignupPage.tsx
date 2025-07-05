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
    role: 'resident'
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      user_name: formData.name,
      user_email: formData.email,
      user_phone_number: formData.phone,
      user_password: formData.password,
      role: formData.role.toLowerCase()
    };

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Signup successful! Your user ID is ${data.user.user_id}`);
        setTimeout(() => navigate("/"), 3000); // Redirect after success
      } else {
        setMessage(data.message || 'Signup failed.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An error occurred while signing up.');
    }
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
