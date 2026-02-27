// src/components/Layout.jsx
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname === '/login';

  return (
    <div className="app">
      {!hideLayout && <Sidebar />}
      <div className="main-content">
        {!hideLayout && <Navbar />}
        {children}
      </div>
    </div>
  );
};

export default Layout;
