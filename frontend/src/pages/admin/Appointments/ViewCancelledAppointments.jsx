import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCancelledAppointments } from "@/redux/appointSlice/appointSlice";
import { useNavigate } from "react-router-dom";

const ViewCancelledAppointments = () => {
  const dispatch = useDispatch();
  const { cancelledAppointments, loading, error } = useSelector(
    (state) => state.appointments
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCancelledAppointments());
  }, [dispatch]);

  if (loading) return <p className="text-center">Loading...</p>;

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
                <td colSpan="10" className="text-center py-2">
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
          onClick={() => navigate("/admin/appointment")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ViewCancelledAppointments;
