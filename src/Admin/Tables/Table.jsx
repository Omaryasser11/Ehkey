import React, { useEffect, useState, useCallback } from "react";
import { Table, Form, Button } from "react-bootstrap";
import _ from 'lodash';
import "./Table.scss";
import CustomerBill from "../CompentsAdmin/CustomerBill/CustomerBill";
import useGetPayments from "../../hooks/admin/payment/useGetPayments";
import Pagination from "../CompentsAdmin/Pagination/Pagination";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ThreeDots } from 'react-loader-spinner'; // Importing a loader component from a library
import Spiner from "../../Spinner/Spinner";

const MyTableComponent = () => {
  const [selectedBillData, setSelectedBillData] = useState(null);
  const { data: originalData, getPayments, success, totalPages } = useGetPayments();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true); // Set loading to true before fetching
      await getPayments(token, currentPage, 10, fromDate, toDate, userId, orderBy, transactionId, selectedStatus);
      setLoading(false); // Set loading to false after fetching
    };
    fetchPayments();
  }, [token, currentPage, fromDate, toDate, userId, orderBy, transactionId, selectedStatus]);

  const debouncedSearch = useCallback(
    _.debounce((query) => {
      setSearchQuery(query);
    }, 300), []
  );

  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  const handleExitCustomerBill = () => {
    setSelectedBillData(null);
  };

  const handleBillClick = (billData) => {
    setSelectedBillData(billData);
  };

  function formatTimeToHHMM(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredData = _.filter(originalData, (item) =>
    item.user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!fromDate || new Date(item.dateTimeStamp).toISOString().slice(0, 10) >= fromDate) &&
    (!toDate || new Date(item.dateTimeStamp).toISOString().slice(0, 10) <= toDate) &&
    (!selectedStatus || item.status === selectedStatus) &&
    (!userId || item.user.id === userId) &&
    (!transactionId || item.transactionId === parseInt(transactionId)) &&
    (!orderBy || item.orderBy === orderBy)
  );

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
  };

  const exportToExcel = () => {
    const totalAmount = _.sumBy(filteredData, 'amount');

    const exportData = _.map(filteredData, item => ({
      id: item.id,
      username: item.user.name,
      email: item.user.email,
      total: item.amount,
      status: item.status,
      date: new Date(item.dateTimeStamp).toLocaleDateString(),
      time: formatTimeToHHMM(item.dateTimeStamp),
      transactionId:item.transactionId
    }));

    exportData.push({
      id: 'Total',
      username: '',
      email: '',
      total: totalAmount,
      status: '',
      date: '',
      time: ''
    });

    const ws = XLSX.utils.json_to_sheet(exportData);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FilteredData');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    saveAs(blob, 'filtered_data.xlsx');
  };

  const totalAmount = _.sumBy(filteredData, 'amount').toFixed(2);

  const resetFilters = () => {
    setSearchQuery('');
    setFromDate('');
    setToDate('');
    setSelectedStatus('');
    setUserId('');
    setOrderBy('');
    setTransactionId('');
    setCurrentPage(1); // Optionally reset to the first page
  };

  return (
    <div className="table-page">
      {loading ? ( // Show loader while loading
        <Spiner />
      ) : selectedBillData ? (
        <div>
          <CustomerBill data={selectedBillData} />
          <Button variant="secondary" onClick={handleExitCustomerBill}>Exit</Button>
        </div>
      ) : (
        <div>
          <div className="header-container">
            <Form.Group controlId="dateRangeFrom" className="inputInBar">
              <Form.Label>From</Form.Label>
              <Form.Control
                type="date"
                placeholder="From"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="dateRangeTo" className="inputInBar">
              <Form.Label>To</Form.Label>
              <Form.Control
                type="date"
                placeholder="To"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="orderStatus" className="DivSelect">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="SelectInpo"
              >
                <option value="">All</option>
                <option value="Successful">Successful</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Failed">Failed</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="searchEmail" className="inputInBar">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by email"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Form.Group>
            <Form.Group controlId="userIdFilter" className="inputInBar">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="transactionIdFilter" className="inputInBar">
              <Form.Label>Transaction ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by Transaction ID"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="orderByFilter" className="inputInBar">
              <Form.Label>Order By</Form.Label>
              <Form.Control
                type="text"
                placeholder="Order By"
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="flex">
              <button className="Button" onClick={resetFilters}>Reset Filters</button>
            </Form.Group>
          </div>

          <Table striped bordered hover className="table">
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Transaction ID</th>
                <th>Status</th>
                <th>Date</th>
                <th>Time</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <Button className="ID" variant="link" onClick={() => handleBillClick(item)}>
                      #{item.id}
                    </Button>
                  </td>
                  <td>{item.user.name}</td>
                  <td>{item.user.email}</td>
                  <td>{item.transactionId ? item.transactionId : "Null"}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.dateTimeStamp).toLocaleDateString()}</td>
                  <td>{formatTimeToHHMM(item.dateTimeStamp)}</td>
                  <td>{item.amount} $</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="flexRSB">
            <div className="action-container">
              <Button variant="primary" onClick={exportToExcel}>Export to Excel</Button>
            </div>
            <div className="total-amount">
              <label className="LBL">Total Amount: </label>
              <p>${totalAmount}</p>
            </div>
          </div>
          <Pagination
            onPageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default MyTableComponent;
