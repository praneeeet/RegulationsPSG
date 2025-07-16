import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink} from 'react-router-dom';
import { FaHome, FaInbox, FaUpload, FaTasks, FaUser } from 'react-icons/fa';

import HomePage from './HomePage';
import HomeContent from './HomeContent';
import ProfilePage from './ProfilePage';
import InboxPage from './InboxPage';
import SubmitPage from './SubmitPage';
import PastSubmissionsPage from './PastSubmissionsPage';
import SubmitNewCurriculum from './SubmitNewCurriculum';
import ReviewPage from './ReviewPage';
import SubmissionPage from './SubmissionPage';
import Footer from './Footer';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <NavLink to="/dashboard" className="sidebar-link" exact activeClassName="active">
          <FaHome className="sidebar-icon" aria-label="Home" />
        </NavLink>
        <NavLink to="/dashboard/inbox" className="sidebar-link" activeClassName="active">
          <FaInbox className="sidebar-icon" aria-label="Inbox" />
        </NavLink>
        <NavLink to="/dashboard/submit" className="sidebar-link" activeClassName="active">
          <FaUpload className="sidebar-icon" aria-label="Submit Curriculum" />
        </NavLink>
        <NavLink to="/dashboard/review" className="sidebar-link" activeClassName="active">
          <FaTasks className="sidebar-icon" aria-label="Review Submissions" />
        </NavLink>
        <div className="sidebar-spacer"></div>
        <NavLink to="/dashboard/profile" className="sidebar-link" activeClassName="active">
          <FaUser className="sidebar-icon" aria-label="View Profile" />
        </NavLink>
      </div>
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="submit" element={<SubmitPage />} />
          <Route path="submit/past" element={<PastSubmissionsPage />} />
          <Route path="submit/new" element={<SubmitNewCurriculum />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="submission/:id" element={<SubmissionPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;