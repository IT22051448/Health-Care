import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailableDates,
  rescheduleAppointment,
} from "@/redux/appointSlice/appointSlice";

const RescheduleModal = ({
  open,
  onClose,
  onReschedule,
  doctorName,
  hospitalName,
  serviceType,
  selectedSubAppointment,
}) => {
  const dispatch = useDispatch(); // Hook to dispatch actions to the Redux store
  const availableDates = useSelector(
    (state) => state.appointments.availableDates || []
  ); // Retrieve available dates from the Redux store
  const loading = useSelector((state) => state.appointments.loading); // Loading state
  const errorMessage = useSelector((state) => state.appointments.error); // Error message from the store

  // State management for dates and times
  const [filteredDates, setFilteredDates] = useState([]); // Filtered available dates
  const [selectedDate, setSelectedDate] = useState(""); // Selected date
  const [selectedTime, setSelectedTime] = useState(""); // Selected time
  const [error, setError] = useState(""); // Error state for form validation

  // Fetch available dates when the modal opens
  useEffect(() => {
    const fetchDates = async () => {
      if (open && doctorName) {
        try {
          await dispatch(
            fetchAvailableDates({ hospitalName, serviceType, doctorName })
          ).unwrap();
        } catch (error) {
          console.error("Error fetching available dates:", error.message);
          setError("Failed to fetch available dates. Please try again.");
        }
      }
    };

    fetchDates();
  }, [open, doctorName, dispatch, hospitalName, serviceType]);

  // Process available dates and group them for display
  useEffect(() => {
    if (availableDates && availableDates.length > 0) {
      const groupedDates = {};
      availableDates.forEach((dateObj) => {
        const dateKey = new Date(dateObj.date).toLocaleDateString("en-GB");
        if (!groupedDates[dateKey]) {
          groupedDates[dateKey] = [];
        }
        groupedDates[dateKey].push(...dateObj.times);
      });

      const uniqueDates = Object.keys(groupedDates).map((date) => ({
        date,
        times: [...new Set(groupedDates[date])], // Remove duplicate times
      }));

      setFilteredDates(uniqueDates); // Update the state with unique dates and times
    } else {
      setFilteredDates([]); // Reset if no available dates
    }
  }, [availableDates]);

  // Handle form submission for rescheduling
  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and a time."); // Validate input
      return;
    }

    // Format the selected date for API
    const dateParts = selectedDate.split("/");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    try {
      const { _id: subAppointmentId, appointmentId } = selectedSubAppointment;

      // Dispatch action to reschedule the appointment
      await dispatch(
        rescheduleAppointment({
          appointmentId,
          subAppointmentId,
          newDate: formattedDate,
          newTimes: selectedTime,
        })
      );

      setError(""); // Clear error message
      onReschedule(formattedDate, selectedTime); // Notify parent component of the successful reschedule
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error rescheduling appointment:", error.message); // Log error for debugging
      setError("Error rescheduling appointment. Please try again."); // Set error message
    }
  };

  return (
    open && (
      <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Reschedule Appointment</h2>
          {loading && <p>Loading available dates...</p>}{" "}
          {/* Loading state message */}
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error messages */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Select Date:</h3>
            <div className="flex flex-wrap">
              {filteredDates.map((dateObj) => (
                <div key={dateObj.date} className="mb-2 mr-2">
                  <div
                    className={`p-2 rounded-lg cursor-pointer border-2 ${
                      selectedDate === dateObj.date
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedDate(dateObj.date); // Update selected date
                      setSelectedTime(""); // Reset selected time
                    }}
                  >
                    {dateObj.date} {/* Display the date */}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedDate && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Select Time:</h4>
              <div className="flex flex-wrap">
                {filteredDates
                  .find((dateObj) => dateObj.date === selectedDate)
                  ?.times.map((time) => (
                    <button
                      key={time}
                      className={`p-2 rounded border-2 ml-0 m-2 ${
                        selectedTime === time
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => {
                        setSelectedTime(time); // Update selected time
                      }}
                    >
                      {time} {/* Display the time */}
                    </button>
                  ))}
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <button
              className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
              onClick={handleSubmit} // Submit the form
            >
              Reschedule
            </button>
            <button
              className="bg-gray-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 ml-2"
              onClick={onClose} // Close the modal
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default RescheduleModal; // Export the component for use in other parts of the application
