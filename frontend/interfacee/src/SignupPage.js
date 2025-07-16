import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    dept_id: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      ...formData,
      dept_id: formData.role === 'Admin' ? null : Number(formData.dept_id)
    };

    try {
      const response = await fetch('http://localhost:3000/api/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(data.message || 'Registration failed');
        return;
      }

      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setLoading(false);
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="content-section">
      <button className="back-button" onClick={() => navigate('/')}>Go Back</button>
      <h1 className="section-title">Sign Up</h1>
      <div className="content-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="">Select Role</option>
              <option value="Program_Coordinator">Program Coordinator</option>
              <option value="HOD">HOD</option>
              <option value="Dean">Dean</option>
              <option value="Principal">Principal</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {formData.role !== 'Admin' && (
            <div className="form-group">
              <label htmlFor="dept_id">Department ID</label>
              <input
                id="dept_id"
                name="dept_id"
                type="number"
                value={formData.dept_id}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter your department ID"
                required
              />
            </div>
          )}

          <button type="submit" className="nav-button" disabled={loading}>
            {loading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center' }}>
          Already have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/login')}>Log in</span>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
