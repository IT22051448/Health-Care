import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  // If the modal is not open, return null (don't render anything)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
        <p className="mb-4">{message}</p>{" "}
        {/* Display the confirmation message */}
        <div className="flex justify-between">
          <button
            onClick={async () => {
              try {
                await onConfirm(); // Attempt to execute the confirmation callback
              } catch (error) {
                console.error("Error during confirmation:", error.message); // Log any errors
                // Optionally, handle the error (e.g., show a notification)
              }
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Yes
          </button>
          <button
            onClick={onClose} // Call the close function to dismiss the modal
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal; // Export the component for use in other parts of the application
