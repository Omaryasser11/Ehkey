import { useState } from "react";
import APIClient from "../../../services/api-service";

const apiClient = new APIClient("/sessions");

const useGetReservations = () => {
  const [error, setError] = useState("");
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState();

  const getReservations = async (
    token,
    pageNumber = 1,
    pageSize = 10,
    fromDate = null,
    toDate = null,
    email = null,
    status = null
  ) => {
    try {
      const queryParams = { pageNumber, pageSize };
      if (fromDate) queryParams.fromDate = fromDate;
      if (toDate) queryParams.toDate = toDate;
      if (email) queryParams.email = email;
      if (status) queryParams.status = status;

      const res = await apiClient.get(queryParams, token);

      setError("");
      setSuccess(true);
      setData(res.data);
      setTotalPages(res.totalPages);

      console.log("res", res);
    } catch (error) {
      setError(error.response.data.message);
      setSuccess(false);
      console.log("error", error);
    }
  };
  return {
    data,
    getReservations,
    success,
    error,
    totalPages,
  };
};

export default useGetReservations;
