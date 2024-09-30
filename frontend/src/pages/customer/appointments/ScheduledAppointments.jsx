import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useSelector } from "react-redux";
import RescheduleModal from "@/components/appointComponents/RescheduleModal";
import axios from "axios";

const ScheduledAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedSubAppointment, setSelectedSubAppointment] = useState(null);
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

  const handleReschedule = (appointment, subAppointment) => {
    console.log("Selected Appointment ID:", appointment._id);
    console.log("Selected Sub-Appointment ID:", subAppointment._id);
    setSelectedAppointment(appointment);
    setSelectedSubAppointment({
      _id: subAppointment._id,
      appointmentId: appointment._id, // Include appointmentId here
    });
    setIsModalOpen(true);
  };

  const handleCancel = (subAppointment) => {
    alert("Cancel button clicked for appointment ID: " + subAppointment._id);
    // Add logic here to cancel the appointment through API if needed
  };

  const confirmReschedule = async (newDate, newTimes) => {
    try {
      const formattedDate = newDate.split("/").reverse().join("-");

      // Construct the appointment and sub-appointment IDs
      const appointmentId = selectedAppointment._id;
      const subAppointmentId = selectedSubAppointment._id;

      // Make the API call to the new endpoint
      const response = await axios.put(
        `http://localhost:5000/api/appoint/reschedule-appointment/${appointmentId}/${subAppointmentId}`,
        {
          newDate: formattedDate, // e.g., "2024-10-05"
          newTimes: newTimes[0], // Use the first selected time if only one is needed
        }
      );

      if (response.status === 200) {
        const updatedAppointments = appointments.map((appt) => {
          if (appt._id === selectedAppointment._id) {
            return {
              ...appt,
              appointments: appt.appointments.map((subAppt) => {
                if (subAppt._id === selectedSubAppointment._id) {
                  return {
                    ...subAppt,
                    date: formattedDate, // Update the date here
                    time: [newTimes[0]], // Update the time here
                  };
                }
                return subAppt;
              }),
            };
          }
          return appt;
        });

        setAppointments(updatedAppointments);
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
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast({
        title: "Error",
        description: "An error occurred while rescheduling appointment.",
        type: "error",
      });
    }
    setIsModalOpen(false);
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
                <div key={appt._id} className="mb-4 border p-2 rounded">
                  <p className="text-gray-700 mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(appt.date).toLocaleDateString("en-GB")} -{" "}
                    {appt.time.join(", ")}
                  </p>
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-red-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-red-700 transition duration-200 shadow mr-2"
                      onClick={() => handleCancel(appt)}
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
              ))}
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
    </div>
  );
};

export default ScheduledAppointments;
