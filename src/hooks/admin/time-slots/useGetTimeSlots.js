import { useState } from "react";
import APIClient from "../../../services/api-service";

const apiClient = new APIClient("/time-slots");

const useGetTimeSlots = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [slots, setSlots] = useState([]);

  const [totalPages, setTotalPages] = useState();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const getTimeSlots = async (
    data = { timezone: userTimeZone },
    _token,
    pageNumber = 1,
    pageSize = 10
  ) => {
    try {
      const res = await apiClient.get(
        { ...data, pageNumber, pageSize },
        _token
      );
      setSuccess(true);
      setError("");
      setSlots(res.data);
      setTotalPages(res.totalPages);
      console.log("res", res);
    } catch (error) {
      console.log(error);
      setSuccess(false);
      setError(error.response?.data?.message || "An error occurred");
    }
  };
  return {
    slots,
    error,
    success,
    getTimeSlots,
    totalPages,
  };
};

export default useGetTimeSlots;
