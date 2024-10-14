import React, { useState } from "react";

const AppointmentModal = ({
  open,
  onClose,
  setSelectedAppointments,
  availableDates,
}) => {
  // State to hold the selected date and time
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);

  // Function to handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTime([]); // Reset selected time when a new date is chosen
  };

  // Function to handle time selection
  const handleTimeClick = (time) => {
    setSelectedTime([time]); // Set selected time
  };

  // Function to add an appointment
  const handleAddAppointment = () => {
    try {
      // Check if a date and time have been selected
      if (!selectedDate || selectedTime.length === 0) {
        alert("Please select a date and at least one time.");
        return; // Exit if validation fails
      }

      // Create a new appointment object
      const newAppointment = {
        date: new Date(selectedDate).toISOString(),
        time: selectedTime,
      };

      // Update the appointments list
      setSelectedAppointments((prev) => [...prev, newAppointment]);
      onClose(); // Close the modal after adding the appointment
    } catch (error) {
      console.error("Error adding appointment:", error.message); // Log any errors that occur
    }
  };

  // Helper function to format the date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Return formatted date string
  };

  // If the modal is not open, return null to prevent rendering
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          Select Appointment Date and Time
        </h2>
        {/* Date Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Available Dates</h3>
          <div className="flex flex-wrap">
            {availableDates.map(({ date }) => (
              <div key={date} className="mb-4 mr-2">
                <div
                  className={`p-3 rounded-lg cursor-pointer border-2 ${
                    selectedDate === date
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 border-gray-300"
                  }`}
                  onClick={() => handleDateClick(date)} // Handle date click
                >
                  {formatDate(date)} {/* Display formatted date */}
                </div>
              </div>
            ))}
          </div>

          {selectedDate && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Available Times</h4>
              <div className="flex flex-wrap">
                {availableDates
                  .find((d) => d.date === selectedDate) // Find selected date
                  ?.times.map((time) => (
                    <button
                      key={time}
                      className={`p-2 rounded border ml-0 m-2 ${
                        selectedTime.includes(time)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handleTimeClick(time)} // Handle time click
                    >
                      {time} {/* Display available time */}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleAddAppointment} // Add appointment on button click
          >
            Add Appointment
          </button>
          <button
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose} // Cancel action on button click
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal; // Export the component for use in other parts of the application
