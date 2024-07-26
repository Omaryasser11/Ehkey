import React, { useState, useEffect } from "react";
import "./ReservationsPage.scss"; // Import SCSS file for styling
import useGetReservations from "../../../hooks/admin/reservation/useGetReservations";
import Pagination from "../../CompentsAdmin/Pagination/Pagination";
import { ThreeDots } from 'react-loader-spinner'; // Importing a loader component
import Spiner from "../../../Spinner/Spinner";

const ReservationsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [orderedBy, setOrderedBy] = useState(''); // New filter state
  const [loading, setLoading] = useState(true); // Add loading state
  const token = localStorage.getItem("authToken");

  const {
    success,
    error,
    getReservations,
    data: originalReservations,
    totalPages,
  } = useGetReservations();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true); // Set loading to true before fetching
      await getReservations(token, currentPage, 10, fromDate, toDate, searchQuery, selectedStatus, orderedBy);
      setLoading(false); // Set loading to false after fetching
    };

    fetchReservations();
  }, [token, currentPage, fromDate, toDate, searchQuery, selectedStatus, orderedBy]);

  const formatTimeToHHMM = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  const handlePageChange = (page) => setCurrentPage(page);

  // Filter reservations based on filters
  const filteredReservations = originalReservations.filter(reservation =>
    (!fromDate || new Date(reservation.startDateTime).toISOString().slice(0, 10) >= fromDate) &&
    (!toDate || new Date(reservation.endDateTime).toISOString().slice(0, 10) <= toDate) &&
    (!searchQuery || reservation.user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (!selectedStatus || reservation.status === selectedStatus)
  ).sort((a, b) => {
    // Sort based on orderedBy value
    if (orderedBy === 'date') {
      return new Date(a.startDateTime) - new Date(b.startDateTime);
    } else if (orderedBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const resetFilters = () => {
    setSearchQuery('');
    setFromDate('');
    setToDate('');
    setSelectedStatus('');
    setOrderedBy(''); // Reset new filter
    setCurrentPage(1); // Optionally reset to the first page
  };

  return (
    <div className="reservations-page mainPage">
      <header className="header-section">
        <h2>Reservations</h2>
        {loading ? ( // Show loader while loading
          <Spiner />
        ) : (
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input
              type="date"
              placeholder="From"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="To"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select
              value={orderedBy}
              onChange={(e) => setOrderedBy(e.target.value)}
            >
              <option value="">Order By</option>
              <option value="date">Date</option>
              <option value="status">Status</option>
            </select>
            <button className="Button" onClick={resetFilters}>Reset Filters</button>
          </div>
        )}
      </header>
      <main>
        <table className="reservation-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.user.name}</td>
                <td>{reservation.user.email}</td>
                <td>
                  <span className="Spanio">From</span> {new Date(reservation.startDateTime).toLocaleDateString()}
                  <span className="Spanio">To</span> {new Date(reservation.endDateTime).toLocaleDateString()}
                </td>
                <td>
                  <span className="Spanio">From</span> {formatTimeToHHMM(reservation.startDateTime)}
                  <span className="Spanio">To</span> {formatTimeToHHMM(reservation.endDateTime)}
                </td>
                <td>{reservation.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          onPageChange={handlePageChange}
          totalPages={totalPages}
          currentPage={currentPage}
        />
      </main>
    </div>
  );
};

export default ReservationsPage;
