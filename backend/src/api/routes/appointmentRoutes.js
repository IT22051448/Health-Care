import express from "express";
import {
  createAppointment,
  getAppointmentsByEmail,
  updateAppointmentDateTime,
  cancelAppointment,
  getCancelledAppointments,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Create a new appointment
router.post("/create-appointment", createAppointment);

// Get appointments by user email
router.get("/scheduled-appointments", getAppointmentsByEmail);

//Update Date and Time
router.put(
  "/reschedule-appointment/:id/:appointmentId",
  updateAppointmentDateTime
);

// Cancel an appointment
router.delete("/cancel-appointment/:id/:appointmentId", cancelAppointment);

// Get all cancelled appointments
router.get("/cancelled-appointments", getCancelledAppointments);

// Get all appointments for the admin
router.get("/all-appointments", getAllAppointments);

// Get specific appointment by ID for admin details view
router.get("/appointment/:id", getAppointmentById);

// Update an appointment
router.put("/update-appointment/:id", updateAppointment);

// Delete an appointment
router.delete("/delete-appointment/:id", deleteAppointment);

export default router;
