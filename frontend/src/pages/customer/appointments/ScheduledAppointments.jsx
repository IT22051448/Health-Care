import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAppointments,
  fetchDoctors,
  rescheduleAppointment,
  cancelAppointment,
} from "@/redux/appointSlice/appointSlice";
import RescheduleModal from "@/components/appointComponents/RescheduleModal";
import CancellationModal from "@/components/appointComponents/CancellationModal";

const ScheduledAppointments = () => {
  // Setting up initial states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancellationModalOpen, setIsCancellationModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSubAppointment, setSelectedSubAppointment] = useState(null);

  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.user?.email); // Get the user's email from the auth state

  // Fetching appointments and doctors
  const appointments =
    useSelector((state) => state.appointments.appointments) || [];
  const doctors = useSelector((state) => state.appointments.doctors) || [];
  const loading = useSelector((state) => state.appointments.loading);

  // If email is available, fetch appointments and doctors
  useEffect(() => {
    if (userEmail) {
      dispatch(fetchAppointments(userEmail));
      dispatch(fetchDoctors());
    } else {
      toast({
        title: "Error",
        description: "User email not found.",
        type: "error",
      });
    }
  }, [dispatch, userEmail]);

  // Retrieve the doctor's image based on their name
  const getDoctorImage = (doctorName) => {
    const doctor = doctors.find((doc) => doc.fullName === doctorName);
    return doctor ? doctor.image : null;
  };

  // Set the selected appointment and sub-appointment for rescheduling
  const handleReschedule = (appointment, subAppointment) => {
    setSelectedAppointment(appointment);
    setSelectedSubAppointment({
      _id: subAppointment._id,
      appointmentId: appointment._id,
    });
    setIsModalOpen(true);
  };

  // Set the selected sub-appointment for cancellation
  const handleCancel = (appointment, subAppointment) => {
    setSelectedSubAppointment({
      ...subAppointment,
      appointmentId: appointment._id,
    });
    setIsCancellationModalOpen(true); // Open the cancellation modal
  };

  // Handle the logic for confirming a reschedule
  const confirmReschedule = async (newDate, newTimes) => {
    const formattedDate = newDate.split("/").reverse().join("-");
    const appointmentId = selectedAppointment._id;
    const subAppointmentId = selectedSubAppointment._id;

    try {
      const action = await dispatch(
        rescheduleAppointment({
          appointmentId,
          subAppointmentId,
          newDate: formattedDate,
          newTimes,
        })
      );

      if (rescheduleAppointment.fulfilled.match(action)) {
        // Show success toast if rescheduling is successful
        toast({
          title: "Success",
          description: "Appointment rescheduled!",
          type: "success",
        });
      } else {
        // Show error toast if rescheduling fails
        toast({
          title: "Error",
          description: "Failed to reschedule appointment.",
          type: "error",
        });
      }
    } catch (error) {
      // Capture any errors during the rescheduling process
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        type: "error",
      });
    }
    setIsModalOpen(false);
  };

  // Handle the logic for confirming a cancellation
  const confirmCancellation = async (reason, description) => {
    const appointmentId = selectedSubAppointment.appointmentId;
    const subAppointmentId = selectedSubAppointment._id;

    try {
      const action = await dispatch(
        cancelAppointment({
          appointmentId,
          subAppointmentId,
          reason,
          description,
        })
      );

      if (cancelAppointment.fulfilled.match(action)) {
        // Show success toast if cancellation is successful
        toast({
          title: "Success",
          description: "Appointment cancelled successfully!",
          type: "success",
        });
      } else {
        // Show error toast if cancellation fails
        toast({
          title: "Error",
          description: "Failed to cancel appointment.",
          type: "error",
        });
      }
    } catch (error) {
      // Capture any errors during the cancellation process
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        type: "error",
      });
    }
    setIsCancellationModalOpen(false); // Close the cancellation modal
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

              <div className="flex justify-between items-center mb-4">
                <div className="flex-grow">
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
                </div>

                {getDoctorImage(appointment.doctor) && (
                  <img
                    src={getDoctorImage(appointment.doctor)}
                    alt={appointment.doctor}
                    className="w-32 h-32 rounded-full border-2 border-cyan-600 mb-10"
                  />
                )}
              </div>

              {appointment.appointments &&
              appointment.appointments.length > 0 ? (
                // Check if there are sub-appointments
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
          onClose={() => setIsModalOpen(false)} // Close the modal when requested
          selectedAppointment={selectedAppointment}
          selectedSubAppointment={selectedSubAppointment}
          onReschedule={confirmReschedule} // Function to handle rescheduling
          doctorName={selectedAppointment.doctor}
          hospitalName={selectedAppointment.hospital}
          serviceType={selectedAppointment.service}
        />
      )}

      {selectedSubAppointment && (
        <CancellationModal
          open={isCancellationModalOpen}
          onClose={() => setIsCancellationModalOpen(false)} // Close the cancellation modal
          onConfirm={confirmCancellation} // Function to handle cancellation
          appointmentId={selectedSubAppointment.appointmentId}
        />
      )}
    </div>
  );
};

export default ScheduledAppointments;
