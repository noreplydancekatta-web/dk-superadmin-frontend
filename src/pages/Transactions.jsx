import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "../styles/Transactions.css";
import API from "../axios";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/api/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    }
  };

  const filtered = transactions.filter((tx) => {
    const studentName = (
      tx.studentName ||
      `${tx.studentId?.firstName || ""} ${tx.studentId?.lastName || ""}`
    ).toLowerCase();

      const studentEmail = (
    tx.studentEmail || tx.studentId?.email || ""
  ).toLowerCase();


    const studioName = tx.studioName?.toLowerCase() || "";

    const transactionId =
      tx.paymentDetails?.transactionId?.toLowerCase() || "";

    return (
      studentName.includes(searchQuery.toLowerCase()) ||
      studioName.includes(searchQuery.toLowerCase()) ||
      transactionId.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="transactions-page">
      <h2>Transactions</h2>
      <p>View and manage all student-studio transactions.</p>

      <div className="search-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Transaction ID, User or Studio"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="transactions-table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Studio</th>
              <th>Batch</th>
              <th>Amount Paid</th>
              <th>Discount %</th>
              <th>Platform Fee %</th>
              <th>GST %</th>
              <th>Method</th>
              <th>Status</th>
              <th>Mode</th>
              <th>Date</th>

            </tr>
          </thead>
          <tbody>
            {filtered.map((tx, index) => (
              <tr key={index}>
                <td>{tx.paymentDetails?.transactionId}</td>
                <td>
                  {tx.studentName || `${tx.studentId?.firstName || ""} ${tx.studentId?.lastName || ""}`}
                </td>
                <td>
                  {tx.studentEmail || tx.studentId?.email || "N/A"}
                </td>
                <td>{tx.studioName}</td>
                <td>{tx.batchId?.batchName}</td>
                <td>₹ {tx.paymentDetails?.amountPaid}</td>
                <td>
                  {tx.paymentDetails?.discountPercent ??
                    tx.discountPercent ??
                    0}
                  %
                </td>
                <td>{tx.platformFeePercent}%</td>
                <td>{tx.gstPercent}%</td>
                <td>{tx.paymentDetails?.paymentMethod}</td>
                <td>
                  <span
                    className={`status ${tx.paymentDetails?.paymentStatus?.toLowerCase()}`}
                  >
                    {tx.paymentDetails?.paymentStatus}
                  </span>
                </td>
                <td>{tx.mode}</td>
                <td>
                  {tx.transactionDate
                    ? new Date(tx.transactionDate).toISOString().split("T")[0]
                    : "N/A"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
