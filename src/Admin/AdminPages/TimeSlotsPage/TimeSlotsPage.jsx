import React, { useEffect, useState } from "react";
import "./TimeSlotPage.scss";
import useGetTimeSlots from "../../../hooks/admin/time-slots/useGetTimeSlots";
import convertTo12HourFormat from "../../../services/convertTo12HourFormat";
import useRemoveTimeSlot from "../../../hooks/admin/time-slots/useRemoveTimeSlot";
import Pagination from "../../CompentsAdmin/Pagination/Pagination";
import useAddTimeSlot from "../../../hooks/admin/time-slots/useAddTimeSlot";
import useUpdateTimeSlotStatus from "../../../hooks/admin/time-slots/useUpdateTimeSlotStatus";
import Swal from 'sweetalert2';
import { Spinner } from "react-bootstrap";
import Spiner from "../../../Spinner/Spinner";

const TimeSlotPage = () => {
  const { getTimeSlots, slots: fetchedSlots, totalPages } = useGetTimeSlots();
  const { addTimeSlot, success: addSuccess } = useAddTimeSlot();
  const { removeTimeSlot, success: removeSuccess, error: removeError } = useRemoveTimeSlot();
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const {
    activateTimeSlot,
    deactivateTimeSlot,
    success: updateSuccess,
  } = useUpdateTimeSlotStatus();

  const [currentPage, setCurrentPage] = useState(1);
  const [slots, setSlots] = useState([]);
  const [showAddTimeSlotPage, setShowAddTimeSlotPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("authToken");

  const [formData, setFormData] = useState({
    day: "",
    from: "",
    to: "",
    duration: "",
    timeZone: userTimeZone,
    isActive: true,
  });

  useEffect(() => {
    setSlots(fetchedSlots);
  }, [fetchedSlots]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Determine the user's timezone dynamically
        // Call getTimeSlots with the dynamically determined timezone
        const data = await getTimeSlots({ timezone: userTimeZone }, token, currentPage);
        setSlots(data);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch time slots. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, addSuccess, updateSuccess, removeSuccess]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Assuming addTimeSlot returns a promise that resolves on success
      await addTimeSlot(formData, token);

      // Clear the form data and set success message
      setFormData({
        day: "",
        from: "",
        to: "",
        duration: "",
        timeZone: userTimeZone,
        isActive: true,
      });

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Time slot added successfully!',
      });
    } catch (error) {
      console.error('Error adding time slot:', error);

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to add time slot. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveTimeSlot = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        try {
          await removeTimeSlot(token, id, (deletedId) => {
            setSlots((prevSlots) => prevSlots.filter(slot => slot.id !== deletedId));
          });
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'The time slot has been deleted.',
          });
        } catch (error) {
          console.error('Error removing time slot:', error);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: removeError || 'Failed to delete time slot. Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const handleActivateTimeSlot = async (id) => {
    setLoading(true);
    try {
      await activateTimeSlot(token, id);
      const updatedSlots = slots.map(slot => {
        if (slot.id === id) {
          return { ...slot, isActive: true };
        }
        return slot;
      });
      setSlots(updatedSlots);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Time slot activated successfully!',
      });
    } catch (error) {
      console.error('Error activating time slot:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to activate time slot. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateTimeSlot = async (id) => {
    setLoading(true);
    try {
      await deactivateTimeSlot(token, id);
      // Update slots after deactivation
      const updatedSlots = slots.map(slot => {
        if (slot.id === id) {
          return { ...slot, isActive: false };
        }
        return slot;
      });
      setSlots(updatedSlots);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Time slot deactivated successfully!',
      });
    } catch (error) {
      console.error('Error deactivating time slot:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to deactivate time slot. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <div className="time-slot-page mainPage col-12">
      <h2>Time Slot Management</h2>

      {showAddTimeSlotPage ? (
        <div className="time-slot-form card p-4 mb-4">
        <h4 className="card-title">Add New Time Slot</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label htmlFor="day">Day</label>
            <select
              id="day"
              name="day"
              className="form-control"
              value={formData.day}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a day</option>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          <div className="form-group mb-3">
            <label htmlFor="from">From</label>
            <input
              type="time"
              id="from"
              name="from"
              className="form-control"
              value={formData.from}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="to">To</label>
            <input
              type="time"
              id="to"
              name="to"
              className="form-control"
              value={formData.to}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group mb-3">
            <label htmlFor="duration">Duration</label>
            <input
              type="text"
              id="duration"
              name="duration"
              className="form-control"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="Duration (e.g., 01:00:00)"
              required
            />
          </div>

          <div className="form-group mb-3">
            <label>
              Available:
              <input
                type="checkbox"
                name="isActive"
                className="ms-2"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
            </label>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Loading..." : "Add Time Slot"}
          </button>
        </form>
        <button onClick={() => setShowAddTimeSlotPage(false)} className="btn btn-link mt-3">
          Available Time Slots
        </button>
      </div>
      ) : (
        <div className="time-slot-list">
          {loading ? (
          <Spiner/>
          ) : slots && slots.length > 0 ? (
            <table className="time-slot-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Available</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {slots.map((slot) => (
                  <tr key={slot.id}>
                    <td>{slot.day}</td>
                    <td>{convertTo12HourFormat(slot.from)}</td>
                    <td>{convertTo12HourFormat(slot.to)}</td>
                    <td>{slot.isActive ? "Yes" : "No"}</td>
                    <td className="slot-actions">
                      <button class="btn btn-danger  btn-sm btnLFT" onClick={() => handleRemoveTimeSlot(slot.id)}>Remove</button>
                      {slot.isActive ? (
                        <button class="btn btn-danger  btn-sm " onClick={() => handleDeactivateTimeSlot(slot.id)}>Deactivate</button>
                      ) : (
                        <button className="btn btn-success  btn-sm " onClick={() => handleActivateTimeSlot(slot.id)}>Activate</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No time slots available.</p>
          )}
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
          <div className="col-12 flex">
            <button onClick={() => setShowAddTimeSlotPage(true)} className="btn">
              Add New Time Slot
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPage;
