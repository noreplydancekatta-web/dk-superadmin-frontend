import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiMapPin,
  FiBarChart2,
  FiTag,
  FiDownload,
  FiFileText,
  FiUser,
  FiLogOut,
  FiDollarSign  // Added icon
} from 'react-icons/fi';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="logo">DanceKatta Admin</div>
      <ul className="sidebar-main">
        <li>
          <NavLink to="/dashboard">
            <FiHome className="sidebar-icon" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/users">
            <FiUsers className="sidebar-icon" /> Users
          </NavLink>
        </li>
        <li>
          <NavLink to="/studios">
            <FiMapPin className="sidebar-icon" /> Studios
          </NavLink>
        </li>
        <li>
          <NavLink to="/demographics">
            <FiBarChart2 className="sidebar-icon" /> Demographics
          </NavLink>
        </li>
        <li>
          <NavLink to="/transactions">
            <FiDollarSign className="sidebar-icon" /> Transactions
          </NavLink>
        </li>
        <li>
          <NavLink to="/coupons">
            <FiTag className="sidebar-icon" /> Coupons & Fees
          </NavLink>
        </li>
        <li>
          <NavLink to="/data_operations">
            <FiDownload className="sidebar-icon" /> Data Operations
          </NavLink>
        </li>
        <li>
          <NavLink to="/StudioReport">
            <FiFileText className="sidebar-icon" /> Studio Reports
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile">
            <FiUser className="sidebar-icon" /> Profile Management
          </NavLink>
        </li>
        <li className="logout-btn" onClick={handleLogout}>
          <span>
            <FiLogOut className="sidebar-icon" /> Logout
          </span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
