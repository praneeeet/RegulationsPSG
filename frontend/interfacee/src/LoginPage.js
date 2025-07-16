import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      // Store token in localStorage (or cookies if preferred)
localStorage.setItem('token', data.access_token); // ✅ This should match the key returned by backend
localStorage.setItem('role', data.user.role);
console.log('Saved token:', data.access_token); // ✅ Use the correct variable


      alert('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      alert('Login error: ' + err.message);
    }
  };

  return (
    <div className="content-section">
      <button className="back-button" onClick={() => navigate('/')}>
        Go Back
      </button>
      <h1 className="section-title">Log In</h1>
      <div className="content-card">
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="nav-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p style={{ textAlign: 'center' }}>
          <u><strong>Login with Google</strong></u> (Not implemented here)
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
