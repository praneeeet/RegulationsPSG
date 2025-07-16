import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { format } from 'date-fns'; // for formatting timestamps

const InboxPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace with your actual token source (e.g., context or localStorage)
  const token = localStorage.getItem('token'); 
  console.log(token);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/api/program-coordinator/submissions/rolled-back', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch inbox submissions');

        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSubmissions();
  }, [token]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatTimestamp = (ts) => format(new Date(ts), 'PPPpp');

  return (
    <div className="content-section">
      <h1 className="section-title">Inbox (Reverted Submissions)</h1>

      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No reverted submissions found.</p>
      ) : (
        <div className="inbox-container">
          {submissions.map((submission) => (
            <div
              key={submission.submission_id}
              className={`inbox-item ${expandedId === submission.submission_id ? 'expanded' : ''}`}
              onClick={() => toggleExpand(submission.submission_id)}
              role="button"
              tabIndex={0}
              aria-expanded={expandedId === submission.submission_id}
              onKeyPress={(e) => e.key === 'Enter' && toggleExpand(submission.submission_id)}
            >
              <div className="inbox-item-summary">
                <span className="submission-id">ID: {submission.submission_id}</span>
                <span className="submission-from">From: {submission.from_whom?.username || 'Unknown'}</span>
                <span className="submission-title">Title: {submission.title}</span>
                <span className="submission-date">{formatTimestamp(submission.submitted_at)}</span>
                {expandedId === submission.submission_id ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              {expandedId === submission.submission_id && (
                <div className="inbox-details">
                  <p><strong>Remarks:</strong> {submission.remarks || 'N/A'}</p>
                  <p><strong>Department:</strong> {submission.department?.department_name}</p>
                  <p><strong>Course:</strong> {submission.course?.course_name}</p>
                  <Link to={`/dashboard/submission/${submission.submission_id}`} className="view-submission-link">
                    View Full Submission
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InboxPage;
