import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@psgtech.ac.in',
    designation: 'Professor',
    department: 'Computer Science',
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewSubmissions = () => {
    navigate('/dashboard/submit/past');
  };

  return (
    <div className="content-section">
      <h1 className="section-title">User Profile</h1>
      <div className="profile-container">
        <div className="profile-details">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={profileData.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="designation">Designation</label>
            <input
              id="designation"
              name="designation"
              type="text"
              value={profileData.designation}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="department">Department</label>
            <input
              id="department"
              name="department"
              type="text"
              value={profileData.department}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
          <button className="nav-button" onClick={handleViewSubmissions}>
            View My Submissions
          </button>
        </div>
        <div className="profile-image">
          <FaImage size={100} color="#371f81" />
          <p>Upload Image</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;