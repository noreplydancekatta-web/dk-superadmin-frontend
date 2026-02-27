import React, { useState } from 'react';
import '../styles/Dashboard.css';
import RevenueChart from '../components/RevenueChart.jsx';

function Dashboard() {
  const [isUserTotal, setIsUserTotal] = useState(true);
  const [isStudioTotal, setIsStudioTotal] = useState(true);

  const totalUsers = 1234;
  const activeUsers = 456;

  const totalStudios = 56;
  const activeStudios = 20;

  const handleUserToggle = () => {
    setIsUserTotal(!isUserTotal);
  };

  const handleStudioToggle = () => {
    setIsStudioTotal(!isStudioTotal);
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="cards">
        {/* User Card Toggle */}
        <div className="card toggle-card" onClick={handleUserToggle}>
          <div className="toggle-card-header">
            <div className={`toggle-background ${isUserTotal ? 'left' : 'right'}`}></div>
            <span className={`toggle-label ${isUserTotal ? 'active' : ''}`}>Total Users</span>
            <span className={`toggle-label ${!isUserTotal ? 'active' : ''}`}>Active Users</span>
          </div>
          <h3>{isUserTotal ? totalUsers : activeUsers}</h3>
        </div>

        {/* Studio Card Toggle */}
        <div className="card toggle-card" onClick={handleStudioToggle}>
          <div className="toggle-card-header">
            <div className={`toggle-background ${isStudioTotal ? 'left' : 'right'}`}></div>
            <span className={`toggle-label ${isStudioTotal ? 'active' : ''}`}>Total Studios</span>
            <span className={`toggle-label ${!isStudioTotal ? 'active' : ''}`}>Active Studios</span>
          </div>
          <h3>{isStudioTotal ? totalStudios : activeStudios}</h3>
        </div>

        {/* Other Static Cards */}
        <div className="card">
          <p>Coupon Usage</p>
          <h3>23%</h3>
        </div>

        <div className="card">
          <p>Revenue</p>
          <h3>₹12,345</h3>
        </div>
      </div>

      <div className="revenue-header">
        <h2>Revenue Trends</h2>
        <button className="manage-users-btn">Manage Users</button>
      </div>

      <div className="revenue-section">
        <RevenueChart />
      </div>
    </div>
  );
}

export default Dashboard;
