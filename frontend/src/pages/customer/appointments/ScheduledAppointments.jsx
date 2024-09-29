import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import RescheduleModal from "@/components/appointComponents/RescheduleModal";

const ScheduledAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const userEmail = useSelector((state) => state.auth.user?.email);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!userEmail) {
        toast({
          title: "Error",
          description: "User email not found.",
          type: "error",
        });
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/appoint/scheduled-appointments?userEmail=${userEmail}`
        );
        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          toast({
            title: "Error",
            description: "Failed to load scheduled appointments.",
            type: "error",
          });
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "An error occurred while fetching appointments.",
          type: "error",
        });
      }
    };

    fetchAppointments();
  }, [userEmail]);

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const confirmReschedule = async (newDate, newTimes) => {
    const formattedDate = newDate.split("/").reverse().join("-"); // Convert dd/mm/yyyy to yyyy-mm-dd
    const updatedAppointments = appointments.map((appt) => {
      if (appt._id === selectedAppointment._id) {
        return {
          ...appt,
          appointments: appt.appointments.map((a) => {
            if (a.date === selectedAppointment.appointments[0].date) {
              return { ...a, date: formattedDate, time: newTimes };
            }
            return a;
          }),
        };
      }
      return appt;
    });

    setAppointments(updatedAppointments);
    console.log("Rescheduled appointments:", updatedAppointments);
    toast({
      title: "Success",
      description: "Appointment rescheduled!",
      type: "success",
    });
  };

  return (
    <div className="bg-blue-50 min-h-screen flex items-center justify-center">
      <div className="container mx-auto p-8 max-w-3xl border border-gray-300 rounded-lg shadow-lg bg-white mt-5 mb-5">
        <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
          Your Appointments
        </h1>

        {appointments.length === 0 ? (
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

              {appointment.appointments.map((appt) => (
                <div key={appt._id} className="mb-2">
                  <p className="text-gray-700 mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(appt.date).toLocaleDateString("en-GB")} -{" "}
                    {appt.time.join(", ")}
                  </p>
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200 shadow"
                  // Add your cancel logic here
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 shadow"
                  onClick={() => handleReschedule(appointment)}
                >
                  Reschedule
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <RescheduleModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAppointment={selectedAppointment}
        onReschedule={confirmReschedule}
        doctorName={selectedAppointment?.doctor}
        hospitalName={selectedAppointment?.hospital}
        serviceType={selectedAppointment?.service}
      />
    </div>
  );
};

export default ScheduledAppointments;
