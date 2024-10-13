import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCancelledAppointments,
  deleteCancelledAppointment,
  deleteAllCancelledAppointments,
} from "@/redux/appointSlice/appointSlice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import ConfirmationModal from "@/components/appointComponents/ConfirmationModal";

const ViewCancelledAppointments = () => {
  const dispatch = useDispatch();
  const { cancelledAppointments, loading } = useSelector(
    (state) => state.appointments
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  // State for managing modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [deleteAll, setDeleteAll] = useState(false);

  useEffect(() => {
    dispatch(fetchCancelledAppointments());
  }, [dispatch]);

  const openModal = (id, isDeleteAll = false) => {
    setCurrentAppointmentId(id);
    setDeleteAll(isDeleteAll);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (deleteAll) {
        await dispatch(deleteAllCancelledAppointments());
        toast({
          title: "Success",
          description: "All cancelled appointments deleted successfully!",
          style: { background: "green", color: "white" },
        });
      } else {
        await dispatch(deleteCancelledAppointment(currentAppointmentId));
        toast({
          title: "Success",
          description: "Appointment deleted successfully!",
          style: { background: "green", color: "white" },
        });
      }
      // Close the modal after successful deletion
      setIsModalOpen(false);
      // Refetch appointments to update the state
      dispatch(fetchCancelledAppointments());
    } catch (error) {
      toast({
        title: "Error",
        description: deleteAll
          ? "Failed to delete all cancelled appointments."
          : "Failed to delete appointment.",
        style: { background: "red", color: "white" },
      });
    } finally {
      setTimeout(() => toast.dismiss(), 3000); // Dismiss after 3 seconds
    }
  };

  const handleDeleteAllCancelledAppointments = () => {
    if (cancelledAppointments.length === 0) {
      toast({
        title: "No Records",
        description: "There are no records to be deleted.",
        type: "info",
      });
      setTimeout(() => toast.dismiss(), 3000); // Dismiss after 3 seconds
    } else {
      openModal(null, true);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Cancelled Appointments</h1>
        <button
          onClick={handleDeleteAllCancelledAppointments}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Delete All Cancelled Appointments
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left text-sm">AID</th>
              <th className="py-2 px-4 border-b text-left text-sm">
                Patient Name
              </th>
              <th className="py-2 px-4 border-b text-left text-sm">Hospital</th>
              <th className="py-2 px-4 border-b text-left text-sm">Service</th>
              <th className="py-2 px-4 border-b text-left text-sm">
                Service Price
              </th>
              <th className="py-2 px-4 border-b text-left text-sm">Doctor</th>
              <th className="py-2 px-4 border-b text-left text-sm">
                Cancelled Date
              </th>
              <th className="py-2 px-4 border-b text-left text-sm">
                Cancelled Time
              </th>
              <th className="py-2 px-4 border-b text-left text-sm">Reason</th>
              <th className="py-2 px-4 border-b text-left text-sm">
                Description
              </th>
              <th className="py-2 px-4 border-b text-left text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cancelledAppointments.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-2">
                  No cancelled appointments found.
                </td>
              </tr>
            ) : (
              cancelledAppointments.map((appointment) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.AID}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.patientName}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.hospital}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.service}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.servicePrice}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.doctor}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {new Date(appointment.cancelledDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.cancelledTime.join(", ")}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.reason}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    {appointment.description || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b text-sm">
                    <button
                      onClick={() => openModal(appointment._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
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
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go Back
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          deleteAll
            ? "Are you sure you want to delete all cancelled appointments records?"
            : "Are you sure you want to delete this cancelled appointment record?"
        }
      />
    </div>
  );
};

export default ViewCancelledAppointments;
