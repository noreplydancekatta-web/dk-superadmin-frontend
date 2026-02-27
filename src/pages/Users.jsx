// Users.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import UserDetailsModal from '../components/UserDetailsModal';
import '../styles/Users.css';
import API from '../axios';

function Users() {
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterActivity, setFilterActivity] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/api/users');
      const mapped = res.data.map(u => ({
  name: `${u.firstName} ${u.lastName}`,
  email: u.email,
  role: u.isStudioOwner ? 'Studio Owner' : 'Student',
  lastActive: u.updatedAt,
  ...u
}));

      setUsers(mapped);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleSaveStatus = async (user, newStatus) => {
  try {
    await API.patch(`/api/users/${user._id}/status`, { status: newStatus });
    await fetchUsers(); // Refresh list
    setModalOpen(false); // Close modal
  } catch (error) {
    console.error("Error updating status:", error);
  }
};


  const isWithinActivity = (lastActive, activityFilter) => {
    const today = new Date();
    const activityDate = new Date(lastActive);
    const diffDays = (today - activityDate) / (1000 * 60 * 60 * 24);

    switch (activityFilter) {
      case 'today': return diffDays < 1;
      case 'last_week': return diffDays <= 7;
      case 'last_month': return diffDays <= 30;
      default: return true;
    }
  };

  const filteredUsers = users.filter(user => {
    const queryMatch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = filterRole ? user.role === filterRole : true;
    const statusMatch = filterStatus ? user.status === filterStatus : true;
    const activityMatch = filterActivity ? isWithinActivity(user.lastActive, filterActivity) : true;

    return queryMatch && roleMatch && statusMatch && activityMatch;
  });

  return (
    <div className="users-page">
      <h2>Users</h2>
      <p>Manage all user accounts, including studio owners and students.</p>

      <div className="search-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filters">
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">Role</option>
            <option value="Studio Owner">Studio Owner</option>
            <option value="Student">Student</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Status</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
          <select value={filterActivity} onChange={(e) => setFilterActivity(e.target.value)}>
            <option value="">Activity</option>
            <option value="today">Today</option>
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role ${user.role === 'Studio Owner' ? 'owner' : 'student'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status ${user.status?.toLowerCase()}`}>
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.lastActive).toISOString().split('T')[0]}</td>
                <td>
                  <button className="view-btn" onClick={() => handleView(user)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <UserDetailsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          user={selectedUser}
          onSaveStatus={handleSaveStatus}
        />
      )}
    </div>
  );
}

export default Users;
