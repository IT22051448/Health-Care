import React, { useState } from "react";

const CardPaymentModal = ({ onClose, onConfirm }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [error, setError] = useState("");

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const grouped = cleaned.match(/.{1,4}/g);
    return grouped ? grouped.join(" ") : "";
  };

  const formatExpiryDate = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) return cleaned;
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  };

  const validateExpiryDate = (expiry) => {
    const [month, year] = expiry.split("/");
    const currentDate = new Date();

    if (parseInt(month, 10) < 1 || parseInt(month, 10) > 12) {
      return "Please enter valid expiry date.";
    }

    const yearInt = parseInt(year, 10);
    let fullYear;

    if (yearInt >= 0 && yearInt <= 50) {
      fullYear = 2000 + yearInt;
    } else if (yearInt >= 51 && yearInt <= 99) {
      fullYear = 1900 + yearInt;
    } else {
      return "Please enter valid expiry date.";
    }

    const expiryDate = new Date(fullYear, month - 1);
    if (expiryDate < currentDate) {
      return "Entered Card is Expired/Invalid";
    }

    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
      setError("Please enter valid card details");
      return;
    }

    const expiryError = validateExpiryDate(expiryDate);
    if (expiryError) {
      setError(expiryError);
      return;
    }

    if (!/^\d{3}$/.test(cvv)) {
      setError("Please enter valid CVV code");
      return;
    }

    if (cardholderName.trim() === "") {
      setError("Cardholder name is required.");
      return;
    }

    onConfirm({ cardNumber, expiryDate, cvv, cardholderName });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-6">Card Payment Details</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
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
              value={formatCardNumber(cardNumber)}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
              maxLength={19}
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
                value={formatExpiryDate(expiryDate)}
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
                maxLength={3}
                placeholder="123"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 rounded-lg py-2 px-4 hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
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

export default CardPaymentModal;
