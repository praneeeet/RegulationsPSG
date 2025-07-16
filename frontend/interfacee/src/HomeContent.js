import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomeContent = () => {
  const navigate = useNavigate();

  return (
    <div className="content-section">
      <h1 className="section-title">Dashboard Home</h1>
      <div className="content-card">
        <p className="section-content">Welcome to your dashboard. Select an option from the sidebar to get started. (Placeholder)</p>
        <button
          className="nav-button"
          onClick={() => navigate('/')}
        >
          Go to Main Page
        </button>
      </div>
    </div>
  );
};

export default HomeContent;