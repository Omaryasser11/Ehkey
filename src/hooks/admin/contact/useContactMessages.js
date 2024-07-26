import { useState } from "react";
import APIClient from "../../../services/api-service";

const apiClient = new APIClient("/contact-us");

const useContactMessages = () => {
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const getContactMessages = async (token, pageNumber = 1, pageSize = 10, From, To, orderBy) => {
    try {
      const params = { pageNumber, pageSize };

      if (From) {
        params.From = new Date(From).toISOString().split('T')[0];
      }

      if (To) {
        params.To = new Date(To).toISOString().split('T')[0];
      }

      if (orderBy) {
        params.orderBy = orderBy;
      }

      const res = await apiClient.get(params, token);
      setError("");
      setSuccess(true);
      setData(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
      setSuccess(false);
    }
  };

  return {
    data,
    success,
    error,
    getContactMessages,
    totalPages,
  };
};

export default useContactMessages;
