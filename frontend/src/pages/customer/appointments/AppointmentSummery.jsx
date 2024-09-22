import React from "react";
import { useLocation } from "react-router-dom";

const AppointmentSummary = () => {
  const location = useLocation();
  const {
    hospital,
    service,
    doctor,
    patientDetails,
    appointments,
    isGovernment,
    serviceAmount,
  } = location.state || {};

  // Calculate total cost
  const totalCost = isGovernment ? 0 : serviceAmount * appointments.length;

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-8 max-w-3xl border border-gray-200 rounded-lg shadow-lg bg-white mt-5 mb-5">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Appointment Summary
        </h1>

        {/* Hospital, Doctor, and Service Section */}
        <div className="bg-blue-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-blue-600">
            Hospital, Doctor, and Service
          </h2>
          <p className="text-gray-700">
            <strong>Hospital:</strong> {hospital}
          </p>
          <p className="text-gray-700">
            <strong>Service:</strong> {service}
          </p>
          <p className="text-gray-700">
            <strong>Doctor:</strong> {doctor}
          </p>
        </div>

        {/* Patient Details Section */}
        <div className="bg-blue-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-blue-600">
            Patient Details
          </h2>
          <p className="text-gray-700">
            <strong>Name:</strong> {patientDetails.fullName}
          </p>
          <p className="text-gray-700">
            <strong>Age:</strong> {patientDetails.age}
          </p>
          <p className="text-gray-700">
            <strong>Gender:</strong> {patientDetails.gender}
          </p>
          <p className="text-gray-700">
            <strong>Description:</strong> {patientDetails.description}
          </p>
        </div>

        {/* Appointments Section */}
        <div className="bg-blue-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-blue-600">Appointments</h2>
          <ul className="list-disc pl-5">
            {appointments.map((appointment, index) => (
              <li key={index} className="text-gray-700">
                <strong>Appointment on:</strong>{" "}
                {new Date(appointment.date).toLocaleDateString("en-GB")}:{" "}
                {appointment.time.join(", ")}
              </li>
            ))}
          </ul>
        </div>

        {/* Payment Summary Section */}
        <div className="bg-blue-100 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-blue-600">
            Payment Summary
          </h2>
          <p className="text-gray-700">
            <strong>Amount per Service:</strong> Rs. {serviceAmount}
          </p>
          <p className="text-gray-700">
            <strong>Number of Appointments:</strong> {appointments.length}
          </p>
          <p className="text-gray-700">
            <strong>Total Cost:</strong>{" "}
            {isGovernment
              ? "No Charge (Government Hospital)"
              : `Rs. ${totalCost}`}
          </p>
        </div>

        {/* Conditional Rendering */}
        {totalCost === 0 ? (
          <div className="text-center mt-8">
            <button className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200">
              Make Appointment
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-blue-600">
              Payment Method
            </h2>
            <select className="border border-gray-300 rounded p-2 w-full mb-4">
              <option value="">Select Payment Method</option>
              <option value="insurance">Insurance</option>
              <option value="cash">Cash</option>
              <option value="card">Card Payment</option>
            </select>
            <div className="text-center">
              <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
                Make Payment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentSummary;
