import '../styles/Navbar.css';
import { LuUser } from 'react-icons/lu'; // Importing User Icon

function Navbar() {
  return (
    <div className="navbar">
      <div className="welcome">Welcome, Admin</div>
      <LuUser className="profile-icon" />
    </div>
  );
}

export default Navbar;
