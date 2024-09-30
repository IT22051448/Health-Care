import express from "express";
import {
  createAppointment,
  getAppointmentsByEmail,
  updateAppointmentDateTime,
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

export default router;
