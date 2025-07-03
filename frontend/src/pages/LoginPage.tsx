import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      setError('Please fill in both fields.');
      return;
    }

    // 🔐 Temporary frontend-only password check
    if (password !== 'password123') {
      setError('Invalid credentials. Please try again.');
      return;
    }

    const upperUsername = username.toUpperCase();

    if (upperUsername.startsWith('R')) {
      navigate('/resident');
    } else if (upperUsername.startsWith('SA')) {
      navigate('/admin');
    } else if (upperUsername.startsWith('M')) {
      navigate('/municipal');
    } else if (upperUsername.startsWith('C')) {
      navigate('/collector');
    } else {
      setError('Invalid username format (e.g. R1, SA2, M3, C4)');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src="/public/TAKAhublogo.png" alt="TAKAHUB logo" className="logo" />
        <h1>TAKAHUB</h1>
        <p className="tagline">Turning Waste Into Worth ♻️</p>
      </div>

      <div className="login-right slide-in">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>Welcome Back!</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          {error && <p className="message" style={{ color: 'red' }}>{error}</p>}

          <p style={{ textAlign: 'center', marginTop: '1rem' }}>
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              style={{
                background: 'none',
                color: '#56ab2f',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              type="button"
            >
              Sign up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
