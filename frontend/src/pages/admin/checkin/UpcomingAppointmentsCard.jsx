import { Card, CardContent } from "@/components/ui/card";
import PropTypes from "prop-types";
import { format } from "date-fns";

function UpcomingAppointmentsCard({ userAppointments }) {
  // Get the current date
  const currentDate = new Date();

  // Create a list of appointments and apply the date filter
  const appointmentList = userAppointments.flatMap((appointment) =>
    appointment.appointments
      .filter((appt) => new Date(appt.date) > currentDate) // Filter for future dates
      .map((appt) => ({
        aid: appointment.AID, // Extracting AID
        hospital: appointment.hospital, // Extracting hospital
        service: appointment.service, // Extracting service type
        doctor: appointment.doctor, // Extracting doctor's name
        date: appt.date, // Extracting appointment date
        time: appt.time.join(", "), // Joining times if there are multiple
        patientName: appointment.patientDetails.fullName, // Extracting patient name
        patientAge: appointment.patientDetails.age, // Extracting patient age
        paymentStatus: appointment.payment.status, // Extracting payment status
      }))
  );

  // Optionally, log the list of upcoming appointments
  console.log("Upcoming Appointments:", appointmentList);

  // Optionally, log the list of appointments
  console.log("List of Appointments:", appointmentList);

  const nextAppointment = appointmentList[0];

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent>
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>

        {nextAppointment ? (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-md font-medium">
              Service: {nextAppointment.service}
            </p>
            <p>Date: {format(new Date(nextAppointment.date), "MM/dd/yyyy")}</p>
            <p>Time: {nextAppointment.time}</p>
            <p>
              Service Amount: Rs. {nextAppointment.payment?.amount || "N/A"}
            </p>
          </div>
        ) : (
          <p>No appointments found</p>
        )}
      </CardContent>
    </Card>
  );
}

// props validation
UpcomingAppointmentsCard.propTypes = {
  userAppointments: PropTypes.array.isRequired,
};

export default UpcomingAppointmentsCard;
