import React, { useState, useEffect } from "react";
import "../styles/UserDetailsModal.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const UserDetailsModal = ({ isOpen, onClose, user, onSaveStatus }) => {
  const [statusChecked, setStatusChecked] = useState(false);
  const [actionLabel, setActionLabel] = useState("");
  const [actionTheme, setActionTheme] = useState(""); // 'red'

  useEffect(() => {
    if (!user) return;
    if (user.status === "Active") {
      setStatusChecked(false);
      setActionLabel("Mark as Disabled");
      setActionTheme("red");
    } else {
      setStatusChecked(true);
      setActionLabel("Mark as Disabled");
      setActionTheme("red");
    }
  }, [user]);

  const handleCheckboxChange = () => {
    setStatusChecked(!statusChecked);
  };

  const handleSave = () => {
    const newStatus = statusChecked ? "Disabled" : "Active";
    if (onSaveStatus) onSaveStatus(user, newStatus);
  };

  if (!isOpen || !user) return null;

  return (
    <div className="user-modal-overlay">
      <div className="user-modal">
        <button className="close-btn" onClick={onClose} aria-label="Close Modal">
          ×
        </button>
        <h2>User Profile</h2>

        {/* Profile Photo */}
        {user.profilePhoto && (
          <div className="profile-photo-wrapper">
            <img
              src={`${BACKEND_URL}${user.profilePhoto}`}
              alt="Profile"
              className="profile-photo"
            />
            <p className="profile-photo-label">Profile Picture</p>
          </div>
        )}

        {/* BASIC INFORMATION */}
        <h3>Basic Information</h3>
        <div className="user-details-grid">
          <div><strong>Name:</strong> {user.firstName} {user.lastName}</div>
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Mobile:</strong> {user.mobile}</div>
          <div><strong>Alt Mobile:</strong> {user.altMobile || '-'}</div>
          <div><strong>Date of Birth:</strong> {user.dateOfBirth?.slice(0, 10)}</div>
          <div><strong>Status:</strong> {user.status}</div>
        </div>

        {/* GUARDIAN */}
        <h3>Guardian Details</h3>
        <div className="user-details-grid">
          <div><strong>Guardian Name:</strong> {user.guardianName || '-'}</div>
          <div><strong>Guardian Mobile:</strong> {user.guardianMobile || '-'}</div>
          <div><strong>Guardian Email:</strong> {user.guardianEmail || '-'}</div>
        </div>

        {/* ADDRESS */}
        <h3>Address</h3>
        <div className="user-details-grid">
          <div><strong>Address:</strong> {user.address}</div>
          <div><strong>City:</strong> {user.city}</div>
          <div><strong>State:</strong> {user.state}</div>
          <div><strong>Pincode:</strong> {user.pincode}</div>
          <div><strong>Country:</strong> {user.country}</div>
        </div>

        {/* SOCIAL */}
        <h3>Social Media</h3>
        <div className="user-details-grid">
          <div><strong>Facebook:</strong> {user.facebook || '-'}</div>
          <div><strong>Instagram:</strong> {user.instagram || '-'}</div>
          <div><strong>YouTube:</strong> {user.youtube || '-'}</div>
        </div>

        {/* PROFESSIONAL */}
        <h3>Professional Info</h3>
        <div className="user-details-grid">
          <div><strong>Professional:</strong> {user.isProfessional ? "Yes" : "No"}</div>
          <div><strong>Experience:</strong> {user.experience} years</div>
        </div>

        {/* SKILLS */}
        <h3>Skills</h3>
        <div className="user-details-grid">
          {user.skills?.length > 0 ? (
            user.skills.map((s, i) => (
              <div key={i}>• {s.style} – {s.level}</div>
            ))
          ) : (
            <div>No skills listed</div>
          )}
        </div>

        {/* STATUS ACTION */}
        <div className={`status-action-section ${actionTheme}`}>
          <label>
            <input
              type="checkbox"
              checked={statusChecked}
              onChange={handleCheckboxChange}
            />{" "}
            {actionLabel}
          </label>
          <p className="status-warning">
            {user.status === "Active"
              ? "Checked users will be disabled and lose access."
              : "Unchecking will reactivate the user."}
          </p>
        </div>

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
