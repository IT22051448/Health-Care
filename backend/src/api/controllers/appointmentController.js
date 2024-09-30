import Appointment from "../models/Appointment.js";
import CancelledAppointment from "../models/CancelledAppointment.js";
import Service from "../models/Service.js";

// Create a new appointment
export const createAppointment = async (req, res) => {
  try {
    const {
      hospital,
      isGovernment,
      service,
      doctor,
      patientDetails,
      appointments,
      payment: { amount, method } = {}, // Destructure payment details from request body
      userEmail,
    } = req.body;

    // Prepare payment details based on hospital type
    const payment = {};

    if (!isGovernment) {
      // This Ensures that the payment details are provided for private hospitals
      if (!amount || !method) {
        return res.status(400).json({
          message:
            "Payment amount and method are required for private hospitals.",
        });
      }

      payment.amount = amount;
      payment.method = method;
      payment.status = method === "Card Payment" ? "Completed" : "Pending"; // Default to "Pending" for cash, "Completed" for others
    } else {
      payment.amount = 0; // No charge for government hospitals
      payment.status = "Completed"; // Automatically mark payment as completed
    }

    // Create a new appointment document
    const newAppointment = new Appointment({
      hospital,
      isGovernment,
      service,
      doctor,
      patientDetails,
      appointments,
      payment,
      userEmail,
    });

    // Save the new appointment to the database
    await newAppointment.save();

    // Send success response
    res.status(201).json({
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    // Error handling
    res
      .status(400)
      .json({ message: "Error creating appointment", error: error.message });
  }
};

export const getAppointmentsByEmail = async (req, res) => {
  try {
    let { userEmail } = req.query; // Expecting userEmail here

    // Trim the userEmail to remove any extra whitespace/newline
    userEmail = userEmail.trim();

    console.log("Received query:", req.query); // Log the entire query object

    if (!userEmail) {
      return res.status(400).json({ message: "Email is required" });
    }

    const appointments = await Appointment.find({ userEmail });

    console.log("Appointments found:", appointments);

    if (appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    // Send success response with appointments data
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error); // More detailed error logging
    res
      .status(500)
      .json({ message: "Error fetching appointments", error: error.message });
  }
};

// Update an existing appointment's specific date and time
export const updateAppointmentDateTime = async (req, res) => {
  try {
    const { id, appointmentId } = req.params;
    const { newDate, newTimes } = req.body;

    // Validate inputs
    if (!newDate || !newTimes || typeof newTimes !== "string") {
      return res.status(400).json({
        message: "New date and time are required.",
      });
    }

    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: id, "appointments._id": appointmentId },
      {
        $set: {
          "appointments.$.date": new Date(newDate),
          "appointments.$.time": [newTimes], // Ensure newTimes is wrapped in an array
        },
      },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating appointment",
      error: error.message,
    });
  }
};

// Cancel a specific appointment
export const cancelAppointment = async (req, res) => {
  const { id, appointmentId } = req.params; // Extract main document ID and specific appointment ID from the URL
  const { reason, description } = req.body; // Reason for cancellation and optional description

  try {
    // Find the main appointment by ID
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Main appointment not found." });
    }

    // Find the specific sub-appointment to cancel
    const subAppointment = appointment.appointments.id(appointmentId);

    if (!subAppointment) {
      return res.status(404).json({ message: "Sub-appointment not found." });
    }

    // Retrieve the price of the service
    const serviceDetails = await Service.findOne({ name: appointment.service });

    if (!serviceDetails) {
      return res.status(404).json({ message: "Service not found." });
    }

    const servicePrice = serviceDetails.amount;

    // Store the canceled appointment in the CancelledAppointment collection
    const cancelledAppointment = new CancelledAppointment({
      userEmail: appointment.userEmail,
      hospital: appointment.hospital,
      service: appointment.service,
      servicePrice, // Include the service price
      doctor: appointment.doctor,
      cancelledDate: subAppointment.date,
      cancelledTime: subAppointment.time,
      reason, // Reason for cancellation
      description, // Optional description
    });

    await cancelledAppointment.save(); // Save the cancelled appointment

    // Remove the sub-appointment from the main appointment's appointments array
    appointment.appointments.pull(appointmentId);

    if (appointment.appointments.length > 0) {
      // If there are remaining appointments, save the updated document
      await appointment.save();
      return res.status(200).json({
        message: "Appointment cancelled and deleted successfully.",
        data: appointment,
      });
    } else {
      // If no remaining appointments, delete the entire main appointment
      await Appointment.findByIdAndDelete(id);
      return res.status(200).json({
        message: "All appointments cancelled, main record removed.",
      });
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res
      .status(500)
      .json({ message: "Error cancelling appointment", error: error.message });
  }
};
