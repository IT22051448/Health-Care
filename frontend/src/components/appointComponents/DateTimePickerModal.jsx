import React, { useState } from "react";

const DateTimePickerModal = ({ onClose, onSubmit }) => {
  const [dateTime, setDateTime] = useState({ date: "", time: "" });
  const [datesList, setDatesList] = useState([]);
  const [error, setError] = useState("");

  const handleAddDate = () => {
    if (!dateTime.date || !dateTime.time) {
      setError("Please select both date and time.");
      return;
    }

    setError("");
    setDatesList([...datesList, dateTime]);
    setDateTime({ date: "", time: "" });
  };

  const handleSubmitDates = () => {
    if (datesList.length === 0) {
      setError("Please add at least one date and time.");
      return;
    }

    setError("");
    onSubmit(datesList);
    setDatesList([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#6F93D9] mb-4">
          Pick Dates & Times
        </h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <div>
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={dateTime.date}
            onChange={(e) => setDateTime({ ...dateTime, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Time</label>
          <input
            type="time"
            value={dateTime.time}
            onChange={(e) => setDateTime({ ...dateTime, time: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md mb-2"
          />
        </div>

        <button
          onClick={handleAddDate}
          className="bg-[#6F93D9] text-white p-2 rounded-md w-full mt-2"
        >
          Add Date & Time
        </button>

        {datesList.length > 0 && (
          <div className="mt-4">
            <h3 className="text-[#6F93D9] font-semibold">
              Dates & Times Added:
            </h3>
            <ul className="list-disc pl-5">
              {datesList.map((dt, index) => (
                <li key={index}>
                  {dt.date} at {dt.time}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <button
            onClick={handleSubmitDates}
            className="bg-[#6F93D9] text-white p-2 rounded-md"
          >
            Submit Dates
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white p-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimePickerModal;
