import React, { useState } from "react";

const CancellationModal = ({ open, onClose, onConfirm, appointmentId }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalDescription, setAdditionalDescription] = useState("");

  const reasons = [
    "No Longer Require Services",
    "Scheduling Conflict",
    "Financial Issues",
    "Other",
  ];

  const handleConfirm = () => {
    onConfirm(selectedReason, additionalDescription, appointmentId);
    onClose();
  };

  if (!open) return null; // Early return if modal isn't open

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Cancel Appointment</h2>

        <div className="mb-4">
          <label htmlFor="reason" className="block text-gray-700 mb-2">
            Cancellation Reason
          </label>
          <select
            id="reason"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select a reason
            </option>
            {reasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Additional Description
          </label>
          <textarea
            id="description"
            value={additionalDescription}
            onChange={(e) => setAdditionalDescription(e.target.value)}
            rows="4"
            className="block w-full p-2 border border-gray-300 rounded"
            placeholder="Optional description..."
          ></textarea>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleConfirm}
          >
            Confirm Cancellation
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal;
