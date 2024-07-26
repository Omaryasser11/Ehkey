import React, { useEffect, useState } from "react";
import "./UsersPage.scss";
import useUsers from "../../../hooks/admin/user/useUsers";
import Pagination from "../../CompentsAdmin/Pagination/Pagination";
import Spiner from "../../../Spinner/Spinner";


const UsersPage = () => {
  const { getUsers, resetFilters, data, totalPages, success, error } = useUsers();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    setLoading(true);
    const filters = {
      email: searchEmail,
      role: searchRole,
      status: searchStatus,
    };
    getUsers(filters, token, currentPage)
      .finally(() => setLoading(false));
  }, [currentPage, searchEmail, searchRole, searchStatus, token, getUsers]);

  useEffect(() => {
    if (success && data) {
      setUsers(data);
    }
  }, [data, success]);

  const handleChangePage = (page) => setCurrentPage(page);

  const handleSearchEmail = (value) => setSearchEmail(value);
  const handleSearchRole = (value) => setSearchRole(value);
  const handleSearchStatus = (value) => setSearchStatus(value);

  const handleResetFilters = () => {
    setSearchEmail("");
    setSearchRole("");
    setSearchStatus("");
    resetFilters(token, currentPage);
  };

  return (
    <div className="users-page mainPage">
      <h1>Users</h1>
      <div className="filters-container">
        <input
          type="text"
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => handleSearchEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Role"
          value={searchRole}
          onChange={(e) => handleSearchRole(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Status"
          value={searchStatus}
          onChange={(e) => handleSearchStatus(e.target.value)}
        />
        <button className="reset-button" onClick={handleResetFilters}>
          Reset Filters
        </button>
      </div>
      {loading ? (
        <Spiner />
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.status}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handleChangePage}
          />
        </>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default UsersPage;
