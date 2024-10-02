import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OngoingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  // Fetch all ongoing appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appoint/all-appointments"
        );
        console.log("Fetched appointments:", response.data); // Log the fetched data
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleDetailsClick = (id) => {
    console.log("Navigating to appointment:", id); // Log the appointment ID being navigated to
    navigate(`/admin/appointments/${id}`);
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Ongoing Appointments</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Patient ID</th>
            <th className="border px-4 py-2">Full Name</th>
            <th className="border px-4 py-2">Hospital</th>
            <th className="border px-4 py-2">Service</th>
            <th className="border px-4 py-2">Doctor</th>
            <th className="border px-4 py-2">Number of Appointments</th>
            <th className="border px-4 py-2">Payment Amount</th>
            <th className="border px-4 py-2">Payment Method</th>
            <th className="border px-4 py-2">Payment Status</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => {
            console.log("Processing appointment:", appointment); // Log each appointment being processed
            return (
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
                  {Array.isArray(appointment.appointments)
                    ? appointment.appointments.length
                    : 0}
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
                    onClick={() => handleDetailsClick(appointment._id)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OngoingAppointments;
