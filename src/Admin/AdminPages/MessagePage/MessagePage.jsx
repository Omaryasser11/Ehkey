import React, { useState, useEffect } from "react";
import "./MessagePage.scss";
import useContactMessages from "../../../hooks/admin/contact/useContactMessages";
import Pagination from "../../CompentsAdmin/Pagination/Pagination";
import Swal from "sweetalert2";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Spiner from "../../../Spinner/Spinner";

const MessagePage = () => {
  const [contactRequests, setContactRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [loading, setLoading] = useState(false);
  const { getContactMessages, data, totalPages } = useContactMessages();
  const token = localStorage.getItem("authToken");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteRequestId, setDeleteRequestId] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      await getContactMessages(token, currentPage, 10, startDate, endDate, orderBy);
      setLoading(false);
    };
    fetchMessages();
  }, [token, currentPage, startDate, endDate, orderBy]);

  useEffect(() => {
    if (data) {
      setContactRequests(data);
    }
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setSearchEmail(value);
    if (value) {
      const results = contactRequests.filter((user) =>
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleDelete = async (id, name) => {
    setDeleteRequestId(id);
    Swal.fire({
      title: "Are you sure?",
      text: `Are you sure you want to delete ${name}'s message?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`https://www.ehkey.com/api/contact-us/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete message');
          }

          setContactRequests(contactRequests.filter(request => request.id !== id));

          Swal.fire({
            title: "Deleted!",
            text: `${name}'s Message has been deleted.`,
            icon: "success"
          });
        } catch (error) {
          console.error("Error deleting message:", error);
          Swal.fire({
            title: "Error",
            text: "Failed to delete message. Please try again later.",
            icon: "error"
          });
        } finally {
          setDeleteRequestId(null);
        }
      } else {
        setDeleteRequestId(null);
      }
    });
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setModalShow(true);
  };

  const closeModal = () => {
    setModalShow(false);
  };

  const displayRequests = searchEmail ? searchResults : contactRequests;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setOrderBy("");
    getContactMessages(token, currentPage, 10, "", "", "");
  };

  return (
    <div className="message-page mainPage">
      <h1>Contact Requests</h1>
      <div className="search-container">
        <Form.Control
          type="text"
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => handleSearch(e.target.value)}
          className="mb-3"
        />
      </div>
      <div className="date-filter-container mb-3">
        <Form.Control
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="me-2"
        />
        <Form.Control
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="me-2"
        />
        <Form.Select
          value={orderBy}
          onChange={(e) => setOrderBy(e.target.value)}
          className="me-2"
        >
          <option value="">Order By</option>
          <option value="dateAsc">Date Ascending</option>
          <option value="dateDesc">Date Descending</option>
        </Form.Select>
        <Button onClick={() => getContactMessages(token, currentPage, 10, startDate, endDate, orderBy)}>
          Filter
        </Button>
        <Button variant="secondary" onClick={resetFilters} className="ms-2">
          Reset Filter
        </Button>
      </div>
      {loading ? (
        <div className="loading-spinner">
     <Spiner/>
        </div>
      ) : (
        <>
          {searchEmail && searchResults.length === 0 ? (
            <p>No results found</p>
          ) : (
            <Table striped bordered hover responsive className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Message (First 5 Words)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayRequests.map((request) => (
                  <tr key={request.id} onClick={() => openModal(request)}>
                    <td>{request.name}</td>
                    <td>{request.email}</td>
                    <td>{request.phoneNumber}</td>
                    <td>{formatDate(request.dateTimeStamp)}</td>
                    <td>{request.message.split(' ').slice(0, 5).join(' ')}</td>
                    <td>
                      <Button variant="danger" onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(request.id, request.name);
                      }}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {!searchEmail && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}

      <Modal show={modalShow && !deleteRequestId} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRequest && selectedRequest.name}'s Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedRequest && selectedRequest.message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MessagePage;
