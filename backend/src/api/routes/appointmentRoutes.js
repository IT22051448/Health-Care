import express from "express";
import {
  createAppointment,
  getAppointmentsByEmail,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Create a new appointment
router.post("/create-appointment", createAppointment);

// Get appointments by user email
router.get("/scheduled-appointments", getAppointmentsByEmail);

export default router;
