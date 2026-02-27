import React, { useState } from "react";
import API from "../axios"; // ✅ Secured API instance
import "../styles/Profile.css";

function Profile() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    // Basic validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      setMessage("");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setMessage("");
      return;
    }

    try {
      const res = await API.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      setMessage(res.data.message || "Password changed successfully.");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Error changing password.");
      setMessage("");
    }
  };

  return (
    <div className="profile-container">
      <h2>Change Password</h2>

      <div className="form-group">
        <label>Current Password</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>New Password</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Confirm New Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button className="save-btn" onClick={handleChangePassword}>
        Update Password
      </button>

      {message && <p className="success-msg">{message}</p>}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}

export default Profile;
