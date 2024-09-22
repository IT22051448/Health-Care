import React, { useState } from "react";

const AppointmentModal = ({
  open,
  onClose,
  setSelectedAppointments,
  availableDates,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTime([]); // Reset time selection
  };

  const handleTimeClick = (time) => {
    setSelectedTime([time]); // Set selected time to a single value
  };

  const handleAddAppointment = () => {
    if (!selectedDate || selectedTime.length === 0) {
      alert("Please select a date and at least one time.");
      return;
    }

    const newAppointment = {
      date: new Date(selectedDate).toISOString(),
      time: selectedTime,
    };
    setSelectedAppointments((prev) => [...prev, newAppointment]);
    onClose(); // Close modal
  };

  if (!open) return null; // Early return if modal isn't open

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
                  onClick={() => handleDateClick(date)}
                >
                  {new Date(date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>

          {selectedDate && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Available Times</h4>
              <div className="flex flex-wrap">
                {availableDates
                  .find((d) => d.date === selectedDate)
                  ?.times.map((time) => (
                    <button
                      key={time}
                      className={`p-2 rounded border ml-0 m-2 ${
                        selectedTime.includes(time)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => handleTimeClick(time)}
                    >
                      {time}
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
            onClick={handleAddAppointment}
          >
            Add Appointment
          </button>
          <button
            className="ml-2 bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;
