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
  const dispatch = useDispatch();
  const availableDates = useSelector(
    (state) => state.appointments.availableDates || []
  ); // Ensure default to empty array
  const loading = useSelector((state) => state.appointments.loading);
  const errorMessage = useSelector((state) => state.appointments.error);

  const [filteredDates, setFilteredDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && doctorName) {
      dispatch(fetchAvailableDates({ hospitalName, serviceType, doctorName }));
    }
  }, [open, doctorName, dispatch]);

  useEffect(() => {
    if (availableDates && availableDates.length > 0) {
      // Check for length
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
    } else {
      setFilteredDates([]); // Reset if no available dates
    }
  }, [availableDates]);

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setError("Please select a date and a time.");
      return;
    }

    const dateParts = selectedDate.split("/");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    try {
      const { _id: subAppointmentId, appointmentId } = selectedSubAppointment;

      await dispatch(
        rescheduleAppointment({
          appointmentId,
          subAppointmentId,
          newDate: formattedDate,
          newTimes: selectedTime,
        })
      );

      setError("");
      onReschedule(formattedDate, selectedTime);
      onClose();
    } catch (error) {
      console.error("Error rescheduling appointment:", error.message);
      setError("Error rescheduling appointment. Please try again.");
    }
  };

  return (
    open && (
      <div className="fixed z-50 inset-0 bg-black bg-opacity-30 flex justify-center items-center">
        <div className="bg-white rounded-lg p-6 shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Reschedule Appointment</h2>
          {loading && <p>Loading available dates...</p>}

          {error && <p className="text-red-500">{error}</p>}
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
                      setSelectedDate(dateObj.date);
                      setSelectedTime("");
                    }}
                  >
                    {dateObj.date}
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
                        setSelectedTime(time);
                      }}
                    >
                      {time}
                    </button>
                  ))}
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <button
              className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600"
              onClick={handleSubmit}
            >
              Reschedule
            </button>
            <button
              className="bg-gray-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 ml-2"
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
