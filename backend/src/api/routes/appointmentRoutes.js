import express from "express";
import { createAppointment } from "../controllers/appointmentController.js";

const router = express.Router();

// Create a new appointment
router.post("/create-appointment", createAppointment);

export default router;
