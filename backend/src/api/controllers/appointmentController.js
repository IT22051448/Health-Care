import Appointment from "../models/Appointment.js";

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
  try {
    const { id, appointmentId } = req.params; // Extract main document ID and specific appointment ID from the URL

    // Find the appointment by ID
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Filter out the appointment to be cancelled
    const remainingAppointments = appointment.appointments.filter(
      appt => appt._id.toString() !== appointmentId
    );

    if (remainingAppointments.length > 0) {
      // Update the main appointment document with the remaining appointments
      appointment.appointments = remainingAppointments;
      await appointment.save(); // Save the updated appointment document
      return res.status(200).json({
        message: "Appointment cancelled successfully",
        data: appointment,
      });
    } else {
      // If no remaining appointments, remove the entire appointment document
      await Appointment.findByIdAndDelete(id);
      return res.status(200).json({
        message:
          "All appointments cancelled successfully, main record removed.",
      });
    }
  } catch (error) {
    // Error handling
    res.status(500).json({
      message: "Error cancelling appointment",
      error: error.message,
    });
  }
};
