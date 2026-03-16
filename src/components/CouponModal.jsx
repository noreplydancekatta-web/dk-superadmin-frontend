import React, { useState, useEffect } from 'react';
import '../styles/CouponModal.css';

function CouponModal({ isOpen, onClose, coupon, onDisable, onUpdateValue }) {
  const [newValue, setNewValue] = useState(coupon?.discountPercent || 0);

  useEffect(() => {
    setNewValue(coupon?.discountPercent || 0);
  }, [coupon]);

  if (!isOpen || !coupon) return null;

  const handleDisable = () => {
    onDisable(coupon._id);
    onClose();
  };

  const handleUpdate = () => {
    if (newValue && newValue > 0) {
      onUpdateValue(coupon._id, newValue);
      onClose();
    }
  };

  return (
    <div className="coupon-modal-overlay">
      <div className="coupon-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Coupon Details</h3>

        <div className="modal-section">
          <p><strong>Code:</strong> {coupon.couponCode}</p>
          <p><strong>Type:</strong> {coupon.couponType === 'StudioSpecific' ? 'Studio Specific' : 'Platform Wide'}</p>
          <p><strong>Studio ID:</strong> {coupon.studioID || 'All Studios'}</p>
          <p><strong>Current Value:</strong> {coupon.discountPercent}%</p>
          <p><strong>Start Date:</strong> {new Date(coupon.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(coupon.expiryDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> 
            <span className={`status-text ${coupon.isActive ? 'active' : 'disabled'}`}>
              {coupon.isActive ? 'Active' : 'Disabled'}
            </span>
          </p>
        </div>

        {!coupon.isActive ? (
          <p className="disabled-msg">This coupon is currently disabled.</p>
        ) : (
          <>
            <div className="form-group">
              <label>Update Discount Value (%)</label>
              <input 
                type="number" 
                value={newValue} 
                onChange={(e) => setNewValue(e.target.value)} 
                min="1" 
                max="100" 
              />
            </div>

            <div className="modal-actions">
              <button className="disable-btn" onClick={handleDisable}>Disable Coupon</button>
              <button className="update-btn" onClick={handleUpdate}>Update Value</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CouponModal;
