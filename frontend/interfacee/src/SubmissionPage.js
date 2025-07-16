import React from 'react';
import { useParams } from 'react-router-dom';

const SubmissionPage = () => {
  const { id } = useParams();
  return (
    <div className="content-section">
      <h1 className="section-title">Submission {id}</h1>
      <div className="content-card">
        <p className="section-content">Details for submission {id}. (Placeholder)</p>
      </div>
    </div>
  );
};

export default SubmissionPage;