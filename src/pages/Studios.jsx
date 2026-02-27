import React, { useState, useEffect } from "react";
import API from "../axios"; // ✅ Secured API instance
import { FaSearch } from "react-icons/fa";
import StudioDetailsModal from "../components/StudioDetailsModal";
import "../styles/Studios.css";

function Studios() {
  const [studios, setStudios] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudio, setSelectedStudio] = useState({});

  useEffect(() => {
    fetchStudios();
  }, []);

  // Fetch studios from backend API
  const fetchStudios = async () => {
    try {
      const res = await API.get("/api/studios"); // ✅ Secured
      setStudios(res.data);
    } catch (error) {
      console.error("Error fetching studios:", error);
    }
  };

  // When "View More" button clicked
  const handleView = (studio) => {
    setSelectedStudio(studio);
    setModalOpen(true);
  };

  // Update status from modal (Approve / Disable)
  const handleSaveStatus = async (studio, newStatus) => {
    try {
      await API.put(`/api/studios/${studio._id}/status`, { status: newStatus });
      fetchStudios(); // refresh updated data
      setModalOpen(false);

      if (newStatus === "Approved") {
        alert(`Studio approved! Email sent to ${studio.contactEmail}`);
      } else if (newStatus === "Disabled") {
        alert(`Studio disabled! Email sent to ${studio.contactEmail}`);
      }


    } catch (error) {
      console.error("Error updating studio status:", error);
      alert("Failed to update studio status");
    }
  };


  // Apply search and status filter
  const filteredStudios = studios.filter((studio) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      studio.studioName.toLowerCase().includes(query) ||
      studio.contactEmail.toLowerCase().includes(query);

    const matchesStatus = filterStatus ? studio.status === filterStatus : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="studios-page">
      <h2>Studios</h2>
      <p>Manage all studio listings on the platform.</p>

      {/* Search and Filter */}
      <div className="search-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search studios by name or email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Studio Table */}
      <div className="studios-table-container">
        <table className="studios-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudios.map((studio) => (
              <tr key={studio._id}>
                <td>{studio.studioName}</td>
                <td>{studio.contactEmail}</td>
                <td>{studio.contactNumber}</td>
                <td>
                  <span
                    className={`status ${studio.status
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`}
                  >
                    {studio.status}
                  </span>
                </td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => handleView(studio)}
                  >
                    View More
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Studio Details Modal */}
      <StudioDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        studio={selectedStudio}
        onSaveStatus={handleSaveStatus}
      />
    </div>
  );
}

export default Studios;
