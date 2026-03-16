import React, { useState, useEffect } from 'react';
import API from '../axios';
import '../styles/Dashboard.css';
import RevenueChart from '../components/RevenueChart.jsx';

function Dashboard() {

  const [isUserTotal, setIsUserTotal] = useState(true);
  const [isStudioTotal, setIsStudioTotal] = useState(true);

  const [users, setUsers] = useState([]);
  const [studios, setStudios] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({
    totalTurnover: 0,
    platformRevenue: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchStudios();
    fetchTransactions();
    fetchMetrics();
  }, []);

  // USERS
  const fetchUsers = async () => {
    try {
      const res = await API.get('/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // STUDIOS
  const fetchStudios = async () => {
    try {
      const res = await API.get('/api/studios');
      setStudios(res.data);
    } catch (err) {
      console.error("Error fetching studios:", err);
    }
  };

  // TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      const res = await API.get('/api/transactions');
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await API.get('/api/transactions/dashboard-metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error("Error fetching metrics:", err);
    }
  };

  // METRICS
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "Active").length;

  const totalStudios = studios.length;
  const activeStudios = studios.filter(s => s.status === "Approved").length;

  const revenue = transactions
    .filter(t => t.paymentDetails?.paymentStatus === "Success")
    .reduce((sum, t) => {
      const amount = t.paymentDetails?.amountPaid || 0;
      const platformFeePercent = t.paymentDetails?.platformFeePercent || 0;

      const platformRevenue = (amount * platformFeePercent) / 100;

      return sum + platformRevenue;
    }, 0);

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="cards">

        {/* Users Card */}
        <div className="card toggle-card" onClick={() => setIsUserTotal(!isUserTotal)}>
          <div className="toggle-card-header">
            <div className={`toggle-background ${isUserTotal ? 'left' : 'right'}`}></div>

            <span className={`toggle-label ${isUserTotal ? 'active' : ''}`}>
              Total Users
            </span>

            <span className={`toggle-label ${!isUserTotal ? 'active' : ''}`}>
              Active Users
            </span>

          </div>

          <h3>{isUserTotal ? totalUsers : activeUsers}</h3>
        </div>


        {/* Studios Card */}
        <div className="card toggle-card" onClick={() => setIsStudioTotal(!isStudioTotal)}>
          <div className="toggle-card-header">

            <div className={`toggle-background ${isStudioTotal ? 'left' : 'right'}`}></div>

            <span className={`toggle-label ${isStudioTotal ? 'active' : ''}`}>
              Total Studios
            </span>

            <span className={`toggle-label ${!isStudioTotal ? 'active' : ''}`}>
              Active Studios
            </span>

          </div>

          <h3>{isStudioTotal ? totalStudios : activeStudios}</h3>
        </div>


        {/* Coupon Usage */}
        <div className="card">
          <p>Coupon Usage</p>
          <h3>
            {
              transactions.length === 0
                ? "0%"
                :
                `${Math.round(
                  (transactions.filter(t => t.couponCode).length / transactions.length) * 100
                )}%`
            }
          </h3>
        </div>


        {/* Revenue */}
        <div className="card">
          <p>Platform Revenue</p>
          <h3>₹{metrics.platformRevenue.toLocaleString()}</h3>
        </div>

        <div className="card">
          <p>Total Turnover</p>
          <h3>₹{metrics.totalTurnover.toLocaleString()}</h3>
        </div>

      </div>

      <div className="revenue-header">
        <h2>Revenue Trends</h2>
      </div>

      <div className="revenue-section">
        <RevenueChart transactions={transactions} />
      </div>

    </div>
  );
}

export default Dashboard;