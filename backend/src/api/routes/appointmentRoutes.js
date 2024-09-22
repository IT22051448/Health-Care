//Route for Appointment

import express from "express";
import {
  createAppointment,
  getAppointments,
  updateAppointment,
  deleteAppointment,
} from "../controllers/appointmentController.js";

const router = express.Router();

//Create an Appointment
router.post("/create-appointment", createAppointment);

// View All appointments
router.get("/view-appointment", getAppointments);

// Update Appointment
router.put("/update-appointment/:id", updateAppointment);

// Delete Appointment
router.delete("/delete-appointment/:id", deleteAppointment);

export default router;
