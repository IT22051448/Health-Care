import React, { useState } from "react";

const CardPaymentModal = ({ onClose, onConfirm }) => {
  // State variables for card details and error messages
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [error, setError] = useState("");

  // Format card number into groups of four digits
  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, ""); // Remove non-digit characters
    const grouped = cleaned.match(/.{1,4}/g); // Group into chunks of 4
    return grouped ? grouped.join(" ") : ""; // Join with spaces
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, ""); // Remove non-digit characters
    if (cleaned.length <= 2) return cleaned; // Return if length is <= 2
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`; // Format as MM/YY
  };

  // Validate the expiry date
  const validateExpiryDate = (expiry) => {
    const [month, year] = expiry.split("/"); // Split into month and year
    const currentDate = new Date(); // Get current date

    // Validate month range
    if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
      return "Please enter valid expiry date.";
    }

    const yearInt = parseInt(year, 10);
    let fullYear;

    // Determine full year based on the input
    if (yearInt >= 0 && yearInt <= 50) {
      fullYear = 2000 + yearInt;
    } else if (yearInt >= 51 && yearInt <= 99) {
      fullYear = 1900 + yearInt;
    } else {
      return "Please enter valid expiry date.";
    }

    const expiryDate = new Date(fullYear, month - 1); // Create expiry date object
    if (expiryDate < currentDate) {
      return "Entered Card is Expired/Invalid"; // Check if the card is expired
    }

    return ""; // No errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(""); // Reset error state

    try {
      // Validate card number format
      if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
        setError("Please enter valid card details");
        return;
      }

      const expiryError = validateExpiryDate(expiryDate); // Validate expiry date
      if (expiryError) {
        setError(expiryError);
        return;
      }

      // Validate CVV format
      if (!/^\d{3}$/.test(cvv)) {
        setError("Please enter valid CVV code");
        return;
      }

      // Check if cardholder name is provided
      if (cardholderName.trim() === "") {
        setError("Cardholder name is required.");
        return;
      }

      // Call onConfirm function with card details
      onConfirm({ cardNumber, expiryDate, cvv, cardholderName });
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error during payment submission:", error.message); // Log any errors
      setError(
        "An error occurred during payment submission. Please try again."
      ); // Set error message
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6">Card Payment Details</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}{" "}
        {/* Display error message */}
        <form onSubmit={handleSubmit}>
          {/* Card Number Field */}
          <div className="mb-4">
            <label
              className="block mb-1 text-sm font-medium"
              htmlFor="cardNumber"
            >
              Card Number:
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formatCardNumber(cardNumber)} // Format card number for display
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              maxLength={19} // Max length for formatted card number
              placeholder="1234 5678 9012 3456"
            />
          </div>

          {/* Cardholder Name Field */}
          <div className="mb-4">
            <label
              className="block mb-1 text-sm font-medium"
              htmlFor="cardholderName"
            >
              Cardholder Name:
            </label>
            <input
              type="text"
              id="cardholderName"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="John Doe"
            />
          </div>

          {/* Expiry Date and CVV Fields */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label
                className="block mb-1 text-sm font-medium"
                htmlFor="expiryDate"
              >
                Expiry Date:
              </label>
              <input
                type="text"
                id="expiryDate"
                value={formatExpiryDate(expiryDate)} // Format expiry date for display
                onChange={(e) =>
                  setExpiryDate(formatExpiryDate(e.target.value))
                }
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium" htmlFor="cvv">
                CVV:
              </label>
              <input
                type="text"
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                maxLength={3} // Max length for CVV
                placeholder="123"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose} // Close the modal without submitting
              className="bg-gray-300 rounded-lg py-2 px-4 hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit" // Submit the form
              className="bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardPaymentModal; // Export the component for use in other parts of the application
