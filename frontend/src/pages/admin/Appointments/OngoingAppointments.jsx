import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAppointments } from "@/redux/appointSlice/appointSlice";

const OngoingAppointments = () => {
  const { appointments, loading } = useSelector((state) => state.appointments);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to manage the selected appointment and the visibility of the details modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  // Fetch all appointments when the component mounts
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        await dispatch(fetchAllAppointments());
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        // You can also show a toast or a notification to the user here
      }
    };
    fetchAppointments();
  }, [dispatch]);

  // Handle click on an appointment to show its details
  const handleDetailsClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetails(true);
  };

  // Close the details modal
  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedAppointment(null);
  };

  // Show a loading indicator while data is being fetched
  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Ongoing Appointments</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Account ID</th>
            <th className="border px-4 py-2">Patient Name</th>
            <th className="border px-4 py-2">Hospital</th>
            <th className="border px-4 py-2">Service</th>
            <th className="border px-4 py-2">Doctor</th>
            <th className="border text-center px-4 py-2">
              Number of Appointments
            </th>
            <th className="border px-4 py-2">Payment Amount</th>
            <th className="border px-4 py-2">Payment Method</th>
            <th className="border px-4 py-2">Payment Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td className="border px-4 py-2">{appointment.AID}</td>
              <td className="border px-4 py-2">
                {appointment.patientDetails?.fullName || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {appointment.hospital || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {appointment.service || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {appointment.doctor || "N/A"}
              </td>
              <td className="border text-center px-4 py-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleDetailsClick(appointment)}
                >
                  {Array.isArray(appointment.appointments)
                    ? appointment.appointments.length
                    : 0}
                </button>
              </td>
              <td className="border px-4 py-2">
                {appointment.isGovernment
                  ? "Government Hospital"
                  : appointment.payment?.amount || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {appointment.isGovernment
                  ? "Government Hospital"
                  : appointment.payment?.method || "N/A"}
              </td>
              <td className="border px-4 py-2">
                {appointment.payment?.status || "N/A"}
              </td>
              <td className="border px-4 py-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() =>
                    navigate(`/admin/appointments/${appointment._id}`)
                  }
                >
                  Update Information
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Appointment Details */}
      {showDetails && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full relative">
            <h2 className="text-xl font-bold">Appointment Dates & Times</h2>

            <h3 className="mt-4">Appointments:</h3>
            <ul className="list-disc ml-5 mb-16">
              {selectedAppointment.appointments.map((appt) => (
                <li key={appt._id}>
                  Date: {new Date(appt.date).toLocaleDateString()} - Time:{" "}
                  {appt.time.join(", ")}
                </li>
              ))}
            </ul>

            <button
              onClick={handleCloseDetails}
              className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OngoingAppointments;
