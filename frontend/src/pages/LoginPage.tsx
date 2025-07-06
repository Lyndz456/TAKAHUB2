import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (username.trim() === '' || password.trim() === '') {
    setError('Please fill in both fields.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: username,
        user_password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message || 'Login failed');
      return;
    }

    // ✅ Save token and redirect based on role
    localStorage.setItem('token', data.token);
    const role = data.user.role.toLowerCase();

    if (role === 'resident') {
      navigate('/resident');
    } else if (role === 'collector') {
      navigate('/collector');
    } else if (role === 'municipal authority') {
      navigate('/municipal');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      setError('Unknown role');
    }

  } catch (err) {
    console.error('Login error:', err);
    setError('Login failed');
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
            placeholder="User ID (e.g. R1)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: 10,
                cursor: 'pointer',
                color: '#888'
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          <label style={{ marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            {' '}Remember me
          </label>

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