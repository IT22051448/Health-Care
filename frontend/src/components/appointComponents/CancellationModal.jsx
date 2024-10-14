import React, { useState } from "react";

const CancellationModal = ({ open, onClose, onConfirm, appointmentId }) => {
  // State for the selected cancellation reason and additional description
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalDescription, setAdditionalDescription] = useState("");

  // Predefined reasons for cancellation
  const reasons = [
    "No Longer Require Services",
    "Scheduling Conflict",
    "Financial Issues",
    "Other",
  ];

  // Function to handle confirmation of cancellation
  const handleConfirm = () => {
    try {
      // Call the onConfirm function with the selected reason, additional description, and appointment ID
      onConfirm(selectedReason, additionalDescription, appointmentId);
      onClose(); // Close the modal after confirmation
    } catch (error) {
      console.error("Error during cancellation:", error.message); // Log any errors that occur
      // Optionally, you could set an error state here to notify the user
    }
  };

  // If the modal is not open, return null to prevent rendering
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Cancel Appointment</h2>

        {/* Dropdown for selecting cancellation reason */}
        <div className="mb-4">
          <label htmlFor="reason" className="block text-gray-700 mb-2">
            Cancellation Reason
          </label>
          <select
            id="reason"
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)} // Update selected reason
            className="block w-full p-2 border border-gray-300 rounded"
          >
            <option value="" disabled>
              Select a reason
            </option>
            {/* Map through reasons to create dropdown options */}
            {reasons.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
        </div>

        {/* Textarea for additional description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">
            Additional Description
          </label>
          <textarea
            id="description"
            value={additionalDescription}
            onChange={(e) => setAdditionalDescription(e.target.value)} // Update additional description
            rows="4"
            className="block w-full p-2 border border-gray-300 rounded"
            placeholder="Optional description..."
          ></textarea>
        </div>

        {/* Buttons for confirming or canceling the action */}
        <div className="mt-6 flex justify-end">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mr-2"
            onClick={handleConfirm} // Confirm cancellation
            disabled={!selectedReason} // Disable button if no reason is selected
          >
            Confirm Cancellation
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose} // Close the modal without confirming
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancellationModal; // Export the component for use in other parts of the application
