import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        email,
        password,
      });

      const { token } = res.data;
      localStorage.setItem('adminToken', token); // store token
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      alert(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Admin Login</h2>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
  <label>Password</label>

  <div style={{ position: "relative" }}>
    <input
      type={showPassword ? "text" : "password"}
      placeholder="••••••••"
      value={password}
      style={{ paddingRight: "40px" }} 
      onChange={(e) => setPassword(e.target.value)}
    />

    <span
      onClick={() => setShowPassword(!showPassword)}
      style={{
        position: "absolute",
        right: "12px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        fontSize: "16px",
        userSelect: "none"
      }}
      
    >
      {showPassword ? "🙈" : "👁️"}
    </span>
  </div>
</div>

        <button className="primary-btn" onClick={handleLogin} disabled={loading}>
          {loading ? <span className="loader"></span> : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
