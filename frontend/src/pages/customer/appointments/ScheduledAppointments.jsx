import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAppointments,
  rescheduleAppointment,
  cancelAppointment,
} from "@/redux/appointSlice/appointSlice";
import RescheduleModal from "@/components/appointComponents/RescheduleModal";
import CancellationModal from "@/components/appointComponents/CancellationModal";

const ScheduledAppointments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSubAppointment, setSelectedSubAppointment] = useState(null);

  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.user?.email);
  const appointments =
    useSelector((state) => state.appointments.appointments) || []; // Ensure it's an array
  const loading = useSelector((state) => state.appointments.loading);

  useEffect(() => {
    if (userEmail) {
      dispatch(fetchAppointments(userEmail));
    } else {
      toast({
        title: "Error",
        description: "User email not found.",
        type: "error",
      });
    }
  }, [dispatch, userEmail]);

  const handleReschedule = (appointment, subAppointment) => {
    setSelectedAppointment(appointment);
    setSelectedSubAppointment({
      _id: subAppointment._id,
      appointmentId: appointment._id,
    });
    setIsModalOpen(true);
  };

  const handleCancel = (appointment, subAppointment) => {
    setSelectedSubAppointment({
      ...subAppointment,
      appointmentId: appointment._id,
    });
    setIsCancellationModalOpen(true);
  };

  const confirmReschedule = async (newDate, newTimes) => {
    const formattedDate = newDate.split("/").reverse().join("-");
    const appointmentId = selectedAppointment._id;
    const subAppointmentId = selectedSubAppointment._id;

    const action = await dispatch(
      rescheduleAppointment({
        appointmentId,
        subAppointmentId,
        newDate: formattedDate,
        newTimes,
      })
    );

    if (rescheduleAppointment.fulfilled.match(action)) {
      toast({
        title: "Success",
        description: "Appointment rescheduled!",
        type: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to reschedule appointment.",
        type: "error",
      });
    }
    setIsModalOpen(false);
  };

  const confirmCancellation = async (reason, description) => {
    const appointmentId = selectedSubAppointment.appointmentId;
    const subAppointmentId = selectedSubAppointment._id;

    const action = await dispatch(
      cancelAppointment({
        appointmentId,
        subAppointmentId,
        reason,
        description,
      })
    );

    if (cancelAppointment.fulfilled.match(action)) {
      toast({
        title: "Success",
        description: "Appointment cancelled successfully!",
        type: "success",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to cancel appointment.",
        type: "error",
      });
    }
    setIsCancellationModalOpen(false);
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-8 max-w-3xl border border-gray-300 rounded-lg shadow-lg bg-white mt-5 mb-5">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Your Appointments
        </h1>

        {loading ? (
          <p className="text-center text-gray-700">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-700">
            No scheduled appointments found.
          </p>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200"
            >
              <h2 className="text-2xl font-semibold text-blue-600 mb-2">
                Appointment with {appointment.doctor}
              </h2>
              <p className="text-gray-700 mb-1">
                <strong>Hospital:</strong> {appointment.hospital}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Service:</strong> {appointment.service}
              </p>
              <p className="text-gray-700 mb-1">
                <strong>Payment Method:</strong>{" "}
                {appointment.payment?.method || "Government Hospital"}
              </p>
              <p className="text-gray-700 mb-5">
                <strong>Payment Status:</strong>{" "}
                {appointment.payment?.status || "Pending"}
              </p>

              {appointment.appointments &&
              appointment.appointments.length > 0 ? (
                appointment.appointments.map((appt) => (
                  <div key={appt._id} className="mb-4 border p-2 rounded">
                    <p className="text-gray-700 mb-1">
                      <strong>Date:</strong>{" "}
                      {new Date(appt.date).toLocaleDateString("en-GB")} -{" "}
                      {appt.time.join(", ")}
                    </p>
                    <div className="flex justify-between mt-4">
                      <button
                        className="bg-red-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-700 transition duration-200 shadow mr-2"
                        onClick={() => handleCancel(appointment, appt)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-blue-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow"
                        onClick={() => handleReschedule(appointment, appt)}
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No sub-appointments available.</p>
              )}
            </div>
          ))
        )}
      </div>

      {selectedAppointment && selectedSubAppointment && (
        <RescheduleModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedAppointment={selectedAppointment}
          selectedSubAppointment={selectedSubAppointment}
          onReschedule={confirmReschedule}
          doctorName={selectedAppointment.doctor}
          hospitalName={selectedAppointment.hospital}
          serviceType={selectedAppointment.service}
        />
      )}

      {selectedSubAppointment && (
        <CancellationModal
          open={isCancellationModalOpen}
          onClose={() => setIsCancellationModalOpen(false)}
          onConfirm={confirmCancellation}
          appointmentId={selectedSubAppointment.appointmentId}
        />
      )}
    </div>
  );
};

export default ScheduledAppointments;
