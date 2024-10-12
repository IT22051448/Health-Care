import React, { useState } from "react";

const InsurancePaymentModal = ({ onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    email: "",
    insuranceCompany: "",
    policyNumber: "",
    groupNumber: "",
    subscriberName: "",
    subscriberDOB: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ ...formData, paymentStatus: "pending" });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-xl font-semibold mb-4">Insurance Payment</h2>
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold mb-2">Patient Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1">Contact (Phone)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Contact (Email)</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
          <h3 className="text-lg font-semibold mb-2">Insurance Information:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1">Insurance Company Name</label>
              <input
                type="text"
                name="insuranceCompany"
                value={formData.insuranceCompany}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Policy Number</label>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Group Number (if applicable)</label>
              <input
                type="text"
                name="groupNumber"
                value={formData.groupNumber}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-1">
                Subscriber Name (if different)
              </label>
              <input
                type="text"
                name="subscriberName"
                value={formData.subscriberName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
            <div>
              <label className="block mb-1">Subscriber's Date of Birth</label>
              <input
                type="date"
                name="subscriberDOB"
                value={formData.subscriberDOB}
                onChange={handleChange}
                className="border border-gray-300 rounded-md p-2 w-full"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-gray-400 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            >
              Confirm Insurance Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InsurancePaymentModal;
