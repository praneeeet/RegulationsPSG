import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

const PastSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem('role'); // "Program_Coordinator", "HOD", "Dean"
  const token = localStorage.getItem('token');

  const getApiUrl = () => {
    switch (role) {
      case 'Program_Coordinator':
        return 'http://localhost:3000/api/api/program-coordinator/submissions';
      case 'HOD':
        return 'http://localhost:3000/api/api/hod/submissions';
      case 'Dean':
        return 'http://localhost:3000/api/api/dean/submissions';
      default:
        return '';
    }
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      const url = getApiUrl();
      if (!url || !token) return;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch submissions');

        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error(error);
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [role, token]);

  return (
    <div className="content-section">
      <h1 className="section-title">View Past Submissions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p>No past submissions found.</p>
      ) : (
        <div className="submissions-history">
          {submissions.map((submission) => (
            <div key={submission.submission_id} className="submission-item">
              <span><strong>ID:</strong> {submission.submission_id}</span>
              <span><strong>Course:</strong> {submission.course?.course_name || 'N/A'}</span>
              <span><strong>Date:</strong> {format(new Date(submission.submitted_at), 'PPPpp')}</span>
              <span><strong>Status:</strong> {submission.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastSubmissionsPage;
