import React, { useState, useEffect } from "react";
import API from "../axios"; // ✅ replaced axios
import CouponModal from "../components/CouponModal";
import "../styles/Coupons.css";

function Coupons() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState({});
  const [platformFee, setPlatformFee] = useState(10);
  const [newFee, setNewFee] = useState(10);
  const [lastUpdated, setLastUpdated] = useState("");
  const [coupons, setCoupons] = useState([]);
  const [studios, setStudios] = useState([]);
  const [gst, setGst] = useState(18);
  const [newGst, setNewGst] = useState(18);

  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "Studio Specific",
    studioEmail: "",
    studioName: "",
    value: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchCoupons();
    fetchStudios();
    fetchPlatformFee();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await API.get("/api/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("Error fetching coupons:", err);
    }
  };

  const fetchStudios = async () => {
    try {
      const res = await API.get("/api/studios");
      setStudios(res.data);
    } catch (err) {
      console.error("Error fetching studios:", err);
    }
  };

  const fetchPlatformFee = async () => {
    try {
      const res = await API.get("/api/platformfee");
      setPlatformFee(res.data.feePercent);
      setNewFee(res.data.feePercent);
      setGst(res.data.gstPercent);
      setNewGst(res.data.gstPercent);
      setLastUpdated(new Date(res.data.updatedAt).toLocaleString());
    } catch (err) {
      console.error("Error fetching platform fee:", err);
    }
  };


  const handleView = (coupon) => {
    setSelectedCoupon(coupon);
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "studioEmail") {
      const selectedStudio = studios.find(studio => studio.contactEmail === value);
      setNewCoupon(prev => ({
        ...prev,
        studioEmail: value,
        studioName: selectedStudio?.studioName || "",
      }));
    } else {
      setNewCoupon(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGenerate = async (e) => {
  e.preventDefault();

  const { code, type, value, studioEmail, startDate, endDate } = newCoupon;

  const studio = studios.find(s => s.contactEmail === studioEmail);

  const today = new Date().setHours(0, 0, 0, 0);
  const start = new Date(startDate).setHours(0, 0, 0, 0);
  const end = new Date(endDate).setHours(0, 0, 0, 0);

  if (type === "Studio Specific" && !studio) {
    alert("Studio not found for the entered email");
    return;
  }

  if (
    !code ||
    !value ||
    !startDate ||
    !endDate ||
    (type === "Studio Specific" && !studioEmail)
  ) {
    alert("Please fill all required fields.");
    return;
  }

  if (start < today || end < today) {
    alert("Start and End dates must be today or in the future.");
    return;
  }

  if (end < start) {
    alert("End Date must be after Start Date.");
    return;
  }

  const couponData = {
    couponCode: code,
    couponType: type === "Studio Specific" ? "StudioSpecific" : "PlatformWide",
    discountPercent: value,
    studioID: type === "Studio Specific" ? studio._id : null,
    startDate: startDate,
    expiryDate: endDate,
    isActive: true,
  };

  try {
    await API.post("/api/coupons", couponData);
    alert("Coupon Generated Successfully!");
    fetchCoupons();

    setNewCoupon({
      code: "",
      type: "Studio Specific",
      studioEmail: "",
      studioName: "",
      value: "",
      startDate: "",
      endDate: "",
    });

  } catch (err) {
    console.error("Error generating coupon:", err);
    alert("Failed to generate coupon");
  }
};

  const handleDisableCoupon = async (id) => {
    try {
      await API.patch(`/api/coupons/disable/${id}`);
      alert("Coupon Disabled Successfully");
      fetchCoupons();
    } catch (err) {
      console.error("Error disabling coupon:", err);
    }
  };

  const handleUpdateCouponValue = async (id, newValue) => {
    try {
      await API.put(`/api/coupons/${id}`, { discountPercent: newValue });
      alert("Coupon Value Updated Successfully");
      fetchCoupons();
    } catch (err) {
      console.error("Error updating coupon value:", err);
    }
  };

  const handlePlatformFeeChange = (e) => {
    setNewFee(e.target.value);
  };

  const handleGstChange = (e) => {
    setNewGst(e.target.value);
  };

  const handlePlatformFeeSubmit = async (e) => {
    e.preventDefault();
    const confirmUpdate = window.confirm("Do you want to update Platform Fee & GST?");
    if (!confirmUpdate) return;

    try {
      const res = await API.put("/api/platformfee", {
        feePercent: parseFloat(newFee),
        gstPercent: parseFloat(newGst),
      });
      setPlatformFee(res.data.feePercent);
      setGst(res.data.gstPercent);
      setLastUpdated(new Date(res.data.updatedAt).toLocaleString());
      alert("Platform Fee & GST Updated Successfully");
    } catch (err) {
      console.error("Error updating platform fee:", err);
      alert("Failed to update platform fee");
    }
  };


  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="coupons-page">
      <h2>Coupons & Fees</h2>

      <form className="platform-fee-box" onSubmit={handlePlatformFeeSubmit}>
        <h3>Platform Fee (%)</h3>
        <div className="fee-inputs">
          <input
            type="number"
            value={newFee}
            onChange={handlePlatformFeeChange}
            min="0"
            max="100"
            required
          />
          <span>%</span>
        </div>

        <h3>GST (%)</h3>
        <div className="fee-inputs">
          <input
            type="number"
            value={newGst}
            onChange={handleGstChange}
            min="0"
            max="100"
            required
          />
          <span>%</span>
        </div>
        <button type="submit" className="update-fee-btn">Update Fee</button>
        {lastUpdated && <p className="last-updated">Last Updated: {lastUpdated}</p>}
      </form>

      <div className="coupon-section">
        <h3>Generate New Coupon</h3>
        <form className="coupon-form" onSubmit={handleGenerate}>
          <div className="form-group">
            <label>Coupon Code *</label>
            <input type="text" name="code" value={newCoupon.code} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Type *</label>
            <select name="type" value={newCoupon.type} onChange={handleChange}>
              <option value="Studio Specific">Studio Specific</option>
              <option value="Platform Wide">Platform Wide</option>
            </select>
          </div>

          {newCoupon.type === "Studio Specific" && (
            <>
              <div className="form-group">
                <label>Studio Email *</label>
                <input
                  type="email"
                  name="studioEmail"
                  value={newCoupon.studioEmail}
                  onChange={handleChange}
                  placeholder="Enter Studio Email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Studio Name</label>
                <input
                  type="text"
                  name="studioName"
                  value={newCoupon.studioName}
                  readOnly
                  placeholder="Auto-filled Studio Name"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Discount Value (%) *</label>
            <input type="number" name="value" value={newCoupon.value} onChange={handleChange} required min="1" max="100" />
          </div>

          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name="startDate"
              value={newCoupon.startDate}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name="endDate"
              value={newCoupon.endDate}
              onChange={handleChange}
              min={newCoupon.startDate || today}
              required
            />
          </div>

          <button type="submit" className="generate-btn">Generate Coupon</button>
        </form>
      </div>

      <div className="coupons-table-container">
        <table className="coupons-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value (%)</th>
              <th>Studio</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.couponCode}</td>
                <td>{coupon.couponType === "StudioSpecific" ? "Studio Specific" : "Platform Wide"}</td>
                <td>{coupon.discountPercent}%</td>
                <td>
                  {coupon.studioID
                    ? studios.find(s => s._id === coupon.studioID)?.studioName || "N/A"
                    : "All"}
                </td>
                <td>{new Date(coupon.startDate).toLocaleDateString()}</td>
                <td>{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status ${coupon.isActive ? "active" : "disabled"}`}>
                    {coupon.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td>
                  <button className="view-btn" onClick={() => handleView(coupon)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CouponModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        coupon={selectedCoupon}
        onDisable={handleDisableCoupon}
        onUpdateValue={handleUpdateCouponValue}
      />
    </div>
  );
}

export default Coupons;