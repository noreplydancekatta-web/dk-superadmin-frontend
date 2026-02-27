import React, { useState, useEffect } from "react";
import API from "../axios"; // ✅ Secured API instance
import "../styles/StudioReport.css";

function StudioReport() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStudio, setSelectedStudio] = useState("");
  const [studioList, setStudioList] = useState([]);

  const today = new Date().toISOString().split("T")[0]; // for max date limit

  useEffect(() => {
    fetchStudios();
  }, []);

  const fetchStudios = async () => {
    try {
      const res = await API.get("/api/studios"); // ✅ secured API call
      setStudioList(res.data);
    } catch (err) {
      console.error("Error fetching studios:", err);
    }
  };

  const handleDownload = async () => {
  if (!startDate || !endDate || !selectedStudio) {
    alert('Please fill in all fields (Date Range and Studio).');
    return;
  }

  if (new Date(endDate) < new Date(startDate)) {
    alert('End Date cannot be before Start Date.');
    return;
  }

  try {
    const response = await API.get(
      `/api/transactions/report/download?studioId=${selectedStudio}&start=${startDate}&end=${endDate}`,
      { responseType: 'blob' }
    );

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute(
      'download',
      `studio-report_${selectedStudio}_${startDate}_to_${endDate}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Download error:', err);
    alert('Failed to download report.');
  }
};


  return (
    <div className="studio-report-container">
      <h2 className="studio-report-title">Download Studio Report</h2>
      <p className="studio-report-subtitle">
        Select a date range and studio to download all registrations across
        branches & batches.
      </p>

      <div className="studio-report-form-box">
        <div className="studio-report-form-group">
          <label>Start Date *</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            max={today}
          />
        </div>

        <div className="studio-report-form-group">
          <label>End Date *</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate}
            max={today}
          />
        </div>

        <div className="studio-report-form-group">
          <label>Select Studio *</label>
          <select
            value={selectedStudio}
            onChange={(e) => setSelectedStudio(e.target.value)}
          >
            <option value="">-- Select Studio --</option>
            {studioList.map((studio) => (
              <option key={studio._id} value={studio._id}>
                {studio.studioName}
              </option>
            ))}
          </select>
        </div>

        <button className="studio-report-download-btn" onClick={handleDownload}>
          Download Report
        </button>
      </div>
    </div>
  );
}

export default StudioReport;
