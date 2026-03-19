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
    <div className="studio-report-page">
      <div className="studio-report-wrapper">

        <div className="studio-report-header">
          <h2>Studio Report</h2>
          <p>Export registrations for a selected studio and date range</p>
        </div>

        <div className="studio-report-panel">

          {/* FORM */}
          <div className="studio-report-grid">

            <div className="field">
              <label>Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
              />
            </div>

            <div className="field">
              <label>End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                max={today}
              />
            </div>

            <div className="field full">
              <label>Studio</label>
              <select
                value={selectedStudio}
                onChange={(e) => setSelectedStudio(e.target.value)}
              >
                <option value="">Select a studio</option>
                {studioList.map((studio) => (
                  <option key={studio._id} value={studio._id}>
                    {studio.studioName}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* ACTION */}
          <div className="studio-report-footer">
            <button onClick={handleDownload}>
              Download CSV
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default StudioReport;
