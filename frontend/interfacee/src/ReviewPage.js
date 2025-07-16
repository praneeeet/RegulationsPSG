import React, { useEffect, useState } from 'react';

const ReviewPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [status, setStatus] = useState('Approved');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const endpoint =
    role === 'HOD'
      ? 'http://localhost:3000/api/api/hod/submissions/pending'
      : 'http://localhost:3000/api/api/dean/submissions';

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch submissions');

        const data = await response.json();
        setSubmissions(data);
      } catch (err) {
        console.error(err);
        setSubmissions([]);
      }
    };

    fetchSubmissions();
  }, [endpoint, token]);

  const handleReview = async (submission_id) => {
    const reviewEndpoint =
      role === 'HOD'
        ? `http://localhost:3000/api/api/hod/submissions/${submission_id}/review`
        : `http://localhost:3000/api/api/dean/submissions/${submission_id}/review`;

    try {
      const res = await fetch(reviewEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, remarks }),
      });

      if (!res.ok) throw new Error('Review failed');
      alert('Review submitted!');
      setRemarks('');
      setStatus('Approved');
      setExpanded(null);
    } catch (err) {
      alert('Error submitting review: ' + err.message);
    }
  };

  return (
    <div className="content-section">
      <h1 className="section-title">Review Submissions ({role})</h1>
      {submissions.length === 0 ? (
        <p>No submissions to review.</p>
      ) : (
        submissions.map((submission) => (
          <div
            key={submission.submission_id}
            className="content-card"
            style={{ marginBottom: '20px' }}
          >
            <h3>
              {submission.title} - {submission.course?.course_name}
            </h3>
            <p>
              <strong>From:</strong> {submission.user?.username} ({submission.user?.role})
            </p>
            <p>
              <strong>Submitted At:</strong>{' '}
              {new Date(submission.submitted_at).toLocaleString()}
            </p>
            <p>
              <strong>Remarks:</strong> {submission.remarks}
            </p>
            <p>
              <strong>PDF:</strong>{' '}
              <a
                href={`http://localhost:3000${submission.pdf_url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF
              </a>
            </p>

            <button onClick={() => setExpanded(submission.submission_id)}>
              {expanded === submission.submission_id ? 'Hide Review Form' : 'Add Review'}
            </button>

            {expanded === submission.submission_id && (
              <div style={{ marginTop: '10px' }}>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="Approved">Approve</option>
                  <option value="Rolled Back">Rollback</option>
                </select>
                <textarea
                  rows="3"
                  placeholder="Enter remarks..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  style={{ width: '100%', marginTop: '8px' }}
                />
                <button onClick={() => handleReview(submission.submission_id)}>
                  Submit Review
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewPage;
