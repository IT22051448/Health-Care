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
    } = req.body;

    // Prepare payment details based on hospital type
    const payment = {};
    if (!isGovernment) {
      payment.amount = req.body.payment.amount; // Get amount from request body
      payment.method = req.body.payment.method; // Get payment method from request body
      payment.status = "Pending"; // Default status for private hospitals
    } else {
      payment.status = "Completed"; // Default status for government hospitals
    }

    const newAppointment = new Appointment({
      hospital,
      isGovernment,
      service,
      doctor,
      patientDetails,
      appointments,
      payment,
    });

    await newAppointment.save();
    res.status(201).json({
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating appointment", error: error.message });
  }
};
