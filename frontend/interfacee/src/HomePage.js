import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="logo-container">
          <img src="psg.png" alt="Curriculum Platform Logo" className="logo" />
          <span className="logo-title">PSG College of Technology</span>
          <br />
          <p>Regulations & Curriculum Portal</p>
        </div>
        <div className="auth-buttons">
          <button className="auth-button login-button" onClick={() => navigate('/login')}>
            Log In
          </button>
          <button className="auth-button signup-button" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </div>
      <div className="hero-content">
        <h1 className="home-title">Welcome to the Curriculum Platform</h1>
        <p className="home-subtitle">Collaborate, share, and review educational curricula seamlessly</p>
        <div className="button-group">
          <button
            onClick={() => navigate('/dashboard')}
            className="nav-button dashboard-button"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/dashboard/profile')}
            className="nav-button profile-button"
          >
            View Profile
          </button>
        </div>
      </div>
      {/* Footer is rendered in App.js, no change needed here */}
    </div>
  );
};

export default HomePage;