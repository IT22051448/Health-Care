import React, { useEffect, useState } from "react";
import axios from "axios";

const RescheduleModal = ({
  open,
  onClose,
  onReschedule,
  doctorName,
  hospitalName,
  serviceType,
  selectedAppointment,
}) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [filteredDates, setFilteredDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && doctorName) {
      fetchAvailableDates(hospitalName, serviceType, doctorName);
    }
  }, [open, doctorName]);

  useEffect(() => {
    if (availableDates.length > 0) {
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
        times: [...new Set(groupedDates[date])],
      }));

      setFilteredDates(uniqueDates);
    }
  }, [availableDates]);

  const fetchAvailableDates = async (hospital, service, doctor) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/doctorService/get-available-dates?hospitalName=${hospital}&serviceType=${service}&doctorName=${doctor}`
      );
      setAvailableDates(response.data);
    } catch (error) {
      setError("Error fetching available dates. Please try again.");
    }
  };

  const handleSubmit = () => {
    if (!selectedDate || selectedTimes.length === 0) {
      setError("Please select a date and at least one time.");
      return;
    }

    const formattedDate = selectedDate.split("/").reverse().join("-"); // Convert dd/mm/yyyy to yyyy-mm-dd
    setError("");
    onReschedule(formattedDate, selectedTimes);
    onClose();
  };

  return (
    open && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-[#6F93D9] mb-4">
            Reschedule Appointment
          </h2>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <h3 className="text-lg font-semibold mb-2">Select a new date:</h3>
          <select
            value={selectedDate}
            onChange={(e) => {
              const newDate = e.target.value;
              setSelectedDate(newDate);
              setSelectedTimes([]); // Reset selected times when date changes
            }}
            className="border border-gray-300 rounded-md p-2 w-full mb-4"
          >
            <option value="">Select Date</option>
            {filteredDates.length > 0 ? (
              filteredDates.map(({ date }) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No dates available
              </option>
            )}
          </select>

          {selectedDate && filteredDates.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Available Times:</h4>
              <div className="flex flex-wrap">
                {filteredDates
                  .find((dateObj) => dateObj.date === selectedDate)
                  ?.times.map((time) => (
                    <button
                      key={time}
                      className={`p-2 rounded border ml-0 m-2 ${
                        selectedTimes.includes(time)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                      onClick={() => {
                        setSelectedTimes([time]);
                      }}
                    >
                      {time}
                    </button>
                  ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              onClick={handleSubmit}
            >
              Confirm Reschedule
            </button>
            <button
              className="ml-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default RescheduleModal;
