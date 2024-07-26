import React, { useEffect, useState } from "react";
import "./AppointmentBooking.scss";
import useAvailableTimeSlots from "../../hooks/time-slots/useAvailableTimeSlots";
import useBookASession from "../../hooks/sessions/useBookASession";
import convertTo12HourFormat from "../../services/convertTo12HourFormat";
import useUpdateSession from "../../hooks/sessions/useUpdateSession";
import Swal from "sweetalert2";

const AppointmentBooking = ({ id = null }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState();
  const [availableAppointments, setAvailableAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { getAvailableTimeSlots, slots } = useAvailableTimeSlots();
  const { bookASession, error, success: bookSuccess } = useBookASession();
  const { updateSession } = useUpdateSession();
  const token = localStorage.getItem("authToken");

  const today = new Date();

  // Get day, month, and year
  let dd = today.getDate();
  let mm = today.getMonth() + 1; // January is 0!
  const yyyy = today.getFullYear();

  // Add leading zero to day if needed
  if (dd < 10) {
    dd = "0" + dd;
  }

  // Add leading zero to month if needed
  if (mm < 10) {
    mm = "0" + mm;
  }

  // Format the date as yyyy-mm-dd
  const formattedDate = `${yyyy}-${mm}-${dd}`;

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
  };

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      getAvailableTimeSlots({ date: selectedDate, timezone: userTimeZone }, token)
        .finally(() => setLoading(false));
      setSelectedSlot("");
    }
  }, [selectedDate]);

  useEffect(() => {
    setAvailableAppointments(slots);
  }, [slots]);

  const handleSelectSlot = (slotId) => {
    setSelectedSlot(slots.find((slot) => slot.id === slotId));
  };

  const handleConfirmABook = () => {
    const data = {
      date: selectedDate,
      timeSlotId: selectedSlot.id,
      timeZone: userTimeZone,
    };
    setLoading(true);
    if (id == null) {
      bookASession(data, token)
        .then(() => {
          Swal.fire({
            title: "Good job!",
            text: `Your Session Date is  ${data.date}`,
            icon: "success"
          });
        })
        .finally(() => setLoading(false));
    } else {
      updateSession(id, data, token)
        .then(() => {
          Swal.fire({
            title: "Good job!",
            text: `Your Session Date Updated successfully to ${data.date} `,
            icon: "success"
          });
        })
        .finally(() => setLoading(false));
    }
    setSelectedDate("");
    setSelectedSlot(null);
    setAvailableAppointments([]);
  };

  return (
    <>
      <div className="maino flex col-9">
        <div className="appointment-booking col-12 ">
          <div className="date-picker flex col-9">
            <label htmlFor="date" className="col-3">
              Select Date
            </label>
            <input
              className="col-7"
              type="date"
              id="date"
              min={formattedDate}
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
        </div>

        <div className="appointment-booking-M ">
          <div className="time-slots col-9">
            <label>Available Time Slots:</label>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {availableAppointments.map((appointment) => (
                  <li
                    id="LI"
                    key={appointment.id}
                    onClick={() => handleSelectSlot(appointment.id)}
                    className={
                      selectedSlot === appointment.time ? "selected" : ""
                    }
                  >
                    {convertTo12HourFormat(appointment.from)} -{" "}
                    {convertTo12HourFormat(appointment.to)} ({appointment.day})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {selectedSlot && (
          <div className="appointment-booking-L ">
            <p className="P col-12 flex">
              You have selected the following appointment:
            </p>
            <p className="p">Date: {selectedDate}</p>
            <p className="p">Day: {selectedSlot.day}</p>
            <p className="p">
              Time: {convertTo12HourFormat(selectedSlot.from)}
            </p>
            <div className="col-12 flex">
              <button onClick={handleConfirmABook} className="Add col-3" disabled={loading}>
                {loading ? "Loading..." : "Confirm"}
              </button>
            </div>
          </div>
        )}
        {error !== "" && selectedSlot && (
          <p
            className="P col-12 flex"
            style={{ fontSize: "12px", color: "red" }}
          >
            {error}
          </p>
        )}
        {bookSuccess && (
          <p
            className="P col-12 flex"
            style={{ fontSize: "12px", color: "green" }}
          >
            Session Booked Successfully
          </p>
        )}
      </div>
    </>
  );
};

export default AppointmentBooking;
