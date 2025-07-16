import React, { useState } from "react";
import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    department_id: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const backendUrl = "http://localhost:3000/api/api/auth";

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    if (formStep < 4) setFormStep(formStep + 1);
  };

  const handleAuth = async () => {
    try {
      const url = `${backendUrl}/${isRegistering ? "register" : "login"}`;
      const payload = isRegistering
        ? {
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed");

      if (!isRegistering) {
        // login successful
        localStorage.setItem("token", `Bearer ${data.access_token}`);
        setUser({ email: formData.email, role: formData.role });
      } else {
        // after register, proceed to login
        setIsRegistering(false);
        setFormStep(0);
        alert("Registration successful. Please log in.");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSubmit = () => {
    console.log("Final Data:", { ...formData });
    handleAuth();
  };

  return (
    <div className="app-container">
      <div className="header-band">
        <img src="/logo192.png" alt="Logo" className="logo-img" />
        <h1 className="university-name">PSG College of Technology</h1>
      </div>

      <nav className="navbar">
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/submit">Submit</a></li>
          <li><a href="/about">About</a></li>
        </ul>
        {!user && (
          <button className="sign-in-btn" onClick={() => setFormStep(1)}>
            {isRegistering ? "Register" : "Log In"}
          </button>
        )}
        {user && <p>Welcome, {user.email} ({user.role})</p>}
      </nav>

      {!user && formStep > 0 && (
        <div className="onboard-form">
          <h2>{isRegistering ? "Register" : "Login"} ({formStep}/4)</h2>

          {formStep === 1 && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          )}
          {formStep === 2 && (
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}
          {isRegistering && formStep === 3 && (
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="">Select Role</option>
              <option value="Program_Coordinator">Program Coordinator</option>
              <option value="HOD">HOD</option>
              <option value="Dean">Dean</option>
              <option value="Principal">Principal</option>
              <option value="Admin">Admin</option>
            </select>
          )}
          {isRegistering && formStep === 4 && formData.role !== "Admin" && (
            <input
              type="number"
              name="department_id"
              placeholder="Department ID"
              value={formData.department_id}
              onChange={handleChange}
            />
          )}

          {formStep < (isRegistering ? 4 : 2) ? (
            <button onClick={handleNext} className="cta-button">Next</button>
          ) : (
            <button onClick={handleSubmit} className="cta-button">
              {isRegistering ? "Register" : "Log In"}
            </button>
          )}

          <p>
            {isRegistering ? "Already registered?" : "Don't have an account?"}{" "}
            <button onClick={() => { setIsRegistering(!isRegistering); setFormStep(1); }} className="text-button">
              {isRegistering ? "Log In" : "Register"}
            </button>
          </p>
        </div>
      )}

      <section className="features">
        <div className="feature">
          <h3>Publish Syllabus</h3>
          <p>Easily publish and manage the syllabus for your department's courses.</p>
        </div>
        <div className="feature">
          <h3>View Curriculums</h3>
          <p>Browse and access currently published curriculums with a clean interface.</p>
        </div>
        <div className="feature">
          <h3>Download Archives</h3>
          <p>Retrieve previous year curriculums for reference and planning.</p>
        </div>
      </section>

      <footer className="footer">
        &copy; {new Date().getFullYear()} PSG College of Technology. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
