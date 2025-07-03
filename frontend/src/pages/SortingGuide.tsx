
import { useNavigate } from 'react-router-dom';

import './SortingGuide.css';

function SortingGuide() {
  const navigate= useNavigate();
  
  return (
    <div className="sorting-guide">
      <h1 className="slide-down">How to Sort Your Waste ♻️</h1>
      <p className="intro-text fade-in">
        Proper sorting helps keep your environment clean and earns you rewards on TAKAHUB!
      </p>

      <div className="waste-cards">
        <div className="card slide-in-left">
          <div className="emoji">🍌</div>
          <h3>Organic Waste</h3>
          <p>Food scraps, fruit peels, leaves, and natural waste go here. Label as Organic Waste!</p>
        </div>

        <div className="card slide-in-right">
          <div className="emoji">🧴</div>
          <h3>Plastic Waste</h3>
          <p>Bottles, containers, wrappers — clean before sorting. Label as Plastic Waste!</p>
        </div>

        <div className="card slide-in-left">
          <div className="emoji">🥫</div>
          <h3>Metal Waste</h3>
          <p>Cans, foil, wires — crush them safely. Label as Metal Waste!</p>
        </div>

        <div className="card slide-in-right">
          <div className="emoji">🔋</div>
          <h3>E-Waste</h3>
          <p>Batteries, phones, remotes — handle with care. Label as E-Waste!</p>
        </div>
      </div>
<div className="waste-cards">
  {/* Existing 4 cards... */}

  <div className="card slide-in-left">
    <div className="emoji">📦</div>
    <h3>Paper & Cardboard</h3>
    <p>Newspapers, cartons, boxes — flatten them. Label as Paper&Cardboard waste!</p>
  </div>

  <div className="card slide-in-right">
    <div className="emoji">🧼</div>
    <h3>Glass</h3>
    <p>Jars and bottles — clean before tossing. Label as Glass!</p>
  </div>

  <div className="card slide-in-left">
    <div className="emoji">🧹</div>
    <h3>General Waste</h3>
    <p>Unrecyclable waste like dust and sweepings.Label as General Waste</p>
  </div>
</div>

      <div className="footer-text fade-in">
        You can now book pickups for specific waste types. Sorting = rewards 💰
      </div>

<div className="nav-buttons">
  <button className="back-btn" onClick={() => navigate('/resident')}>
    ← Back to Home Page
  </button>
  <button className="pickup-btn" onClick={() => navigate('/book-pickup')}>
    📦 Book a Pickup
  </button>
</div>


    </div>
    

    
  );
}

export default SortingGuide;
