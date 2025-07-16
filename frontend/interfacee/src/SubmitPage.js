import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubmitPage = () => {
  const navigate = useNavigate();

  return (
    <div className="content-section">
      <h1 className="section-title">Submit Curriculum</h1>
      <div className="submit-options">
        <button
          className="nav-button"
          onClick={() => navigate('/dashboard/submit/past')}
        >
          View Past Submissions
        </button>
        <button
          className="nav-button"
          onClick={() => navigate('/dashboard/submit/new')}
        >
          Submit New Curriculum
        </button>
      </div>
    </div>
  );
};

export default SubmitPage;