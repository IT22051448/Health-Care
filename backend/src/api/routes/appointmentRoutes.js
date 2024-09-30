import express from "express";
import {
  createAppointment,
  getAppointmentsByEmail,
  updateAppointmentDateTime,
  cancelAppointment,
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

export default router;
