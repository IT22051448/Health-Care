import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewCancelledAppointments = () => {
  const [cancelledAppointments, setCancelledAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchCancelledAppointments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/appoint/cancelled-appointments"
        );
        setCancelledAppointments(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledAppointments();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Cancelled Appointments</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-1 px-2 border-b text-left text-sm">AID</th>
              <th className="py-1 px-2 border-b text-left text-sm">
                User Email
              </th>
              <th className="py-1 px-2 border-b text-left text-sm">Hospital</th>
              <th className="py-1 px-2 border-b text-left text-sm">Service</th>
              <th className="py-1 px-2 border-b text-left text-sm">
                Service Price
              </th>
              <th className="py-1 px-2 border-b text-left text-sm">Doctor</th>
              <th className="py-1 px-2 border-b text-left text-sm">
                Cancelled Date
              </th>
              <th className="py-1 px-2 border-b text-left text-sm">
                Cancelled Time
              </th>
              <th className="py-1 px-2 border-b text-left text-sm">Reason</th>
              <th className="py-1 px-2 border-b text-left text-sm">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {cancelledAppointments.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-2">
                  No cancelled appointments found.
                </td>
              </tr>
            ) : (
              cancelledAppointments.map((appointment, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.AID}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.userEmail}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.hospital}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.service}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.servicePrice}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.doctor}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {new Date(appointment.cancelledDate).toLocaleDateString()}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.cancelledTime.join(", ")}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.reason}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {appointment.description || "N/A"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button
          onClick={() => navigate("/admin/appointment")} // Navigate to the appointment page
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ViewCancelledAppointments;
