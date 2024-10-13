import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CardPaymentModal from "@/components/appointComponents/CardPaymentModel";
import InsurancePaymentModal from "@/components/appointComponents/InsurancePaymentModal";
import { toast } from "@/hooks/use-toast";
import { useDispatch } from "react-redux";
import { createAppointment } from "@/redux/appointSlice/appointSlice";

const AppointmentSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    hospital,
    service,
    doctor,
    patientDetails,
    appointments,
    isGovernment,
    serviceAmount,
    userEmail,
    AID,
  } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [paymentAmount, setPaymentAmount] = useState(
    serviceAmount * appointments.length
  );
  const [showCardModal, setShowCardModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);

  const totalCost = isGovernment ? 0 : paymentAmount;

  const handlePayment = async () => {
    if (isGovernment || paymentMethod) {
      const appointmentData = {
        hospital,
        service,
        doctor,
        patientDetails,
        appointments,
        isGovernment,
        payment: {
          amount: isGovernment ? 0 : paymentAmount,
          method: isGovernment ? "government" : paymentMethod,
        },
        userEmail: userEmail || "",
        AID: AID || "",
      };

      try {
        const response = await dispatch(
          createAppointment(appointmentData)
        ).unwrap();

        toast({
          title: "Success",
          description: "Appointment created successfully!",
          type: "success",
        });
        console.log("Appointment created:", response);

        navigate("/patient/scheduled-appoint");
      } catch (error) {
        console.error("Error creating appointment:", error);
        toast({
          title: "Error",
          description: "Failed to create appointment. Please try again.",
          type: "error",
        });
      }
    } else {
      toast({
        title: "Payment Method Not Selected",
        description: "Please select a payment method.",
        type: "warning",
      });
    }
  };

  const handleCardPayment = async () => {
    setShowCardModal(false);
    await handlePayment();
  };

  const handleInsurancePayment = async () => {
    setShowInsuranceModal(false);

    const appointmentData = {
      hospital,
      service,
      doctor,
      patientDetails,
      appointments,
      isGovernment,
      payment: {
        amount: isGovernment ? 0 : paymentAmount,
        method: "Insurance",
        status: "pending",
      },
      userEmail: userEmail || "",
      AID: AID || "",
    };

    try {
      const response = await dispatch(
        createAppointment(appointmentData)
      ).unwrap();

      toast({
        title: "Success",
        description: "Appointment created successfully!",
        type: "success",
      });
      console.log("Appointment created:", response);

      navigate("/patient/scheduled-appoint");
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        type: "error",
      });
    }
  };

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

        {/* Conditional Rendering for Government or Paid Services */}
        {totalCost === 0 ? (
          <div className="flex justify-between mt-8">
            <button
              className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
              onClick={() => navigate("/patient/appointment")}
            >
              Go Back to Book Appointment
            </button>
            <button
              className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200"
              onClick={handlePayment}
            >
              Confirm Appointment (Government)
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-blue-600 mb-5">
              Payment Method
            </h2>
            <div className="flex space-x-4 mb-4">
              {["Cash", "Insurance", "Card Payment"].map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(method);
                    if (method === "Card Payment") {
                      setShowCardModal(false);
                    }
                  }}
                  className={`flex-1 py-2 border rounded-md text-sm ${
                    paymentMethod === method
                      ? "bg-blue-500 text-white border-blue-600"
                      : "bg-white text-black border-gray-300"
                  } hover:bg-blue-500 transition duration-200`}
                >
                  {method}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-10">
              <button
                className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
                onClick={() => navigate("/patient/appointment")}
              >
                Go Back to Book Appointment
              </button>
              <button
                className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => {
                  if (paymentMethod === "Card Payment") {
                    setShowCardModal(true);
                  } else if (paymentMethod === "Insurance") {
                    setShowInsuranceModal(true);
                  } else {
                    handlePayment();
                  }
                }}
              >
                Make Payment
              </button>
            </div>
          </div>
        )}

        {/* Payment Modals */}
        {showCardModal && (
          <CardPaymentModal
            onClose={() => setShowCardModal(false)}
            onConfirm={handleCardPayment}
          />
        )}
        {showInsuranceModal && (
          <InsurancePaymentModal
            onClose={() => setShowInsuranceModal(false)}
            onConfirm={handleInsurancePayment}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentSummary;
