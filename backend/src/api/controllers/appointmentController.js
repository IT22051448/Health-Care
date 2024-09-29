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
