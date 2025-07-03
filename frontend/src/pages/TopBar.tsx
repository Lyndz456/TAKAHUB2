import { Link, useNavigate } from 'react-router-dom';
import './TopBar.css';

function TopBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logic to clear session/context here
    navigate('/');
  };

  return (
    <div className="topbar">
      <div className="nav-links">
        <Link to="/resident">Home</Link>
        <Link to="/book-pickup">Book Pickup</Link>
        <Link to="/rewards">Rewards</Link>
      </div>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
}

export default TopBar;
