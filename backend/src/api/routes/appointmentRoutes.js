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
  deleteCancelledAppointment,
  deleteAllCancelledAppointments,
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

// Get all appointments for the admin
router.get("/all-appointments", getAllAppointments);

// Get specific appointment by ID for admin details view
router.get("/appointment/:id", getAppointmentById);

// Update an appointment
router.put("/update-appointment/:id", updateAppointment);

// Delete an appointment
router.delete("/delete-appointment/:id", deleteAppointment);

// Cancel an appointment
router.delete("/cancel-appointment/:id/:appointmentId", cancelAppointment);

// Get all cancelled appointments
router.get("/cancelled-appointments", getCancelledAppointments);

// Delete a specific cancelled appointment
router.delete("/delete-cancelled-appointments/:id", deleteCancelledAppointment);

// Delete all cancelled appointments
router.delete("/delete-cancelled-appointments", deleteAllCancelledAppointments);

export default router;
