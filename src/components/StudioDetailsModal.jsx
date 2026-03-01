import React, { useState, useEffect } from "react";
import "../styles/StudioDetailsModal.css";

const StudioDetailsModal = ({ isOpen, onClose, studio, onSaveStatus }) => {
  const [statusChecked, setStatusChecked] = useState(false);
  const [actionLabel, setActionLabel] = useState("");
  const [actionTheme, setActionTheme] = useState("");
  const [enlargedImage, setEnlargedImage] = useState(null);

  const handleImageClick = (src) => {
    setEnlargedImage(src);
  };

  const handleCloseEnlarged = (e) => {
    if (e.target.classList.contains("enlarged-image-overlay")) {
      setEnlargedImage(null);
    }
  };

  useEffect(() => {
    if (!studio) return;

    const status = studio.status;

    if (status === "Pending") {
      setStatusChecked(false);
      setActionLabel("Mark as Approved");
      setActionTheme("green");
    } else if (status === "Approved") {
      setStatusChecked(false);
      setActionLabel("Mark as Disabled");
      setActionTheme("red");
    } else if (status === "Disabled") {
      setStatusChecked(true);
      setActionLabel("Uncheck to Re-Activate");
      setActionTheme("red");
    }
  }, [studio]);

  if (!isOpen || !studio) return null;

  const handleCheckboxChange = () => {
    setStatusChecked(!statusChecked);
  };

  const handleSave = () => {
    let newStatus = studio.status;

    if (studio.status === "Pending") {
      newStatus = statusChecked ? "Approved" : "Pending";
    } else if (studio.status === "Approved") {
      newStatus = statusChecked ? "Disabled" : "Approved";
    } else if (studio.status === "Disabled") {
      newStatus = statusChecked ? "Disabled" : "Approved";
    }

    if (onSaveStatus) onSaveStatus(studio, newStatus);
  };

  return (
    <div className="studio-modal-overlay">
      <div className="studio-modal">
        <h2>Studio Application Details</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        {/* Logo */}
        {studio.logoUrl && (
          <div className="studio-logo-section">
            <img
              src={studio.logoUrl}
              alt="Studio Logo"
              className="studio-logo"
              onClick={() => handleImageClick(studio.logoUrl)}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "8px",
                margin: "5px",
                cursor: "pointer",
              }}
            />
          </div>
        )}

        <h3>Basic Information</h3>
        <div className="studio-details-grid">
          <div><strong>Name:</strong> {studio.studioName}</div>
          <div><strong>Owner:</strong> {studio.ownerId}</div>
          <div><strong>Status:</strong> {studio.status}</div>
          <div><strong>Introduction:</strong> {studio.studioIntroduction}</div>
        </div>

        <h3>Contact Information</h3>
        <div className="studio-details-grid">
          <div><strong>Email:</strong> {studio.contactEmail}</div>
          <div><strong>Contact:</strong> {studio.contactNumber}</div>
          <div><strong>Address:</strong> {studio.registeredAddress}</div>
        </div>

        <h3>Bank & Legal Information</h3>
        <div className="studio-details-grid">
          <div><strong>GST No:</strong> {studio.gstNumber}</div>
          <div><strong>PAN No:</strong> {studio.panNumber}</div>
          <div><strong>Aadhar No:</strong> {studio.aadharNumber}</div>
          <div><strong>Bank Acc No:</strong> {studio.bankAccountNumber}</div>
          <div><strong>Bank IFSC:</strong> {studio.bankIfscCode}</div>
        </div>

        <h3>Social Media Links</h3>
        <div className="studio-details-grid">
          <div><strong>Website:</strong> {studio.studioWebsite}</div>
          <div><strong>Facebook:</strong> {studio.studioFacebook}</div>
          <div><strong>Instagram:</strong> {studio.studioInstagram}</div>
          <div><strong>YouTube:</strong> {studio.studioYoutube}</div>
        </div>

        <h3>Application Timeline</h3>
        <div className="studio-details-grid">
          <div><strong>Created At:</strong> {studio.createdAt}</div>
          <div><strong>Updated At:</strong> {studio.updatedAt}</div>
        </div>

        {/* Aadhar Images */}
        <div className="aadhar-section">
          <h3>Aadhar Card Images</h3>
          {studio.aadharFrontPhoto && (
            <img
              src={studio.aadharFrontPhoto}
              alt="Aadhar Front"
              onClick={() => handleImageClick(studio.aadharFrontPhoto)}
            />
          )}
          {studio.aadharBackPhoto && (
            <img
              src={studio.aadharBackPhoto}
              alt="Aadhar Back"
              onClick={() => handleImageClick(studio.aadharBackPhoto)}
            />
          )}
        </div>

        {/* Studio Photos */}
        <div className="studio-photos-section">
          <h3>Studio Photos</h3>
          <div className="studio-images-grid">
            {studio.studioPhotos && studio.studioPhotos.length > 0 ? (
              studio.studioPhotos.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Studio ${index + 1}`}
                  onClick={() => handleImageClick(img)}
                  style={{
                    width: "240px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                />
              ))
            ) : (
              <p>No photos available</p>
            )}
          </div>
        </div>

        {/* Status Section */}
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
            {studio.status === "Pending" &&
              "Check to approve this studio (Studio will be visible to all users on DanceKatta)."}
            {studio.status === "Approved" &&
              "Check to disable this studio."}
            {studio.status === "Disabled" &&
              "Uncheck to re-activate this studio (set to Approved)."}
          </p>
        </div>

        <div className="modal-actions">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      {/* Enlarged Image View */}
      {enlargedImage && (
        <div className="enlarged-image-overlay" onClick={handleCloseEnlarged}>
          <img
            src={enlargedImage}
            alt="Enlarged"
            className="enlarged-image"
          />
        </div>
      )}
    </div>
  );
};

export default StudioDetailsModal;
