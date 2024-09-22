import Appointment from "../models/Appointment.js";

//Create an Appointment
export const createAppointment = async (req, res) => {
  try {
    const appointmentData = req.body;
    const appointment = new Appointment(appointmentData);
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully", appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All appointments
export const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update One Appointment
export const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const appointmentData = req.body;

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      appointmentData,
      { new: true, runValidators: true }
    );
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res
      .status(200)
      .json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete One Appointment
export const deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
