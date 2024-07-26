import { useState } from "react";
import APIClient from "../../../services/api-service";

const apiClient = new APIClient("/admin/payments");

const useGetPayments = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState();

  const getPayments = async (
    token, 
    pageNumber = 1, 
    pageSize = 10, 
    fromDate = null, 
    toDate = null, 
    userId = null, 
    orderBy = null, 
    transactionId = null, 
    status = null
  ) => {
    try {
      // Construct the query parameters object
      const queryParams = { pageNumber, pageSize };
      if (fromDate) queryParams.fromDate = fromDate;
      if (toDate) queryParams.toDate = toDate;
      if (userId) queryParams.userId = userId;
      if (orderBy) queryParams.orderBy = orderBy;
      if (transactionId) queryParams.transactionId = transactionId;
      if (status) queryParams.status = status;

      console.log("Sending request with params:", queryParams); // Debug line

      const res = await apiClient.get(queryParams, token);

      setError("");
      setSuccess(true);
      setData(res.data);
      setTotalPages(res.totalPages);

      console.log("Received response:", res.data); // Debug line
    } catch (error) {
      setError(error.response.data.message);
      setSuccess(false);
      console.log("API error:", error); // Debug line
    }
  };

  return {
    data,
    getPayments,
    success,
    error,
    totalPages,
  };
};

export default useGetPayments;
