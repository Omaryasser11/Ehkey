import React, { useState } from "react";
import axios from "axios";
import "./CreateAccount.scss";
import { domain } from "../../../services/api-service";

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    country: "",
    password: "",
    role: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const token = localStorage.getItem("authToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error message
    setFieldErrors([]); // Clear previous field errors
    setSuccessMessage(""); // Clear previous success message
  
    console.log("Submitting form with data:", formData);
  
    try {
      const response = await axios.post(domain + "/api/users", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("User created:", response.data);
      if (response.status === 200) {
        setSuccessMessage("User created successfully!");
        setFormData({
          email: "",
          firstName: "",
          lastName: "",
          phone: "",
          country: "",
          password: "",
          role: "",
        });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { message, errors } = error.response.data;
        setErrorMessage(message || "An error occurred. Please try again.");
        setFieldErrors(errors || []);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      console.error("Error creating user:", error);
    }
  };
  
  return (
    <div className="create-account-form mainPage">
      <h2>Add User</h2>
      <form
        onSubmit={handleSubmit}
        className="col-10 flex flex-column align-items-center"
      >
        {errorMessage && (
          <div className="error-message text-danger col-12">{errorMessage}</div>
        )}
        {fieldErrors.length > 0 && (
          <ul className="error-list col-10">
            {fieldErrors.map((error, index) => (
              <li key={index} className="error-message text-danger ">
                {error}
              </li>
            ))}
          </ul>
        )}
        {successMessage && (
          <div className="success-message text-success col-12">
            {successMessage}
          </div>
        )}

        <div className="col-12">
          <div className="col-10">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-10">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-10">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-10">
            <label>Phone:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-10">
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-10">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-10">
            <label>Role:</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="Client">Client</option>
              <option value="Admin">Admin</option>
              <option value="SuperAdmin">Super Admin</option>
              <option value="FinanceAdmin">Finance Admin</option>
              <option value="OperationAdmin">Operation Admin</option>
            </select>
          </div>
        </div>
        <button className="col-7" type="submit">
          Add User
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
