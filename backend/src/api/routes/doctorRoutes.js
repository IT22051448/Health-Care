import express from "express";
import {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController.js";

const router = express.Router();

// Create a new doctor profile
router.post("/create-doctor", createDoctor);

// Get all doctors
router.get("/get-doctors", getAllDoctors);

// Get a doctor by ID
router.get("/get-doctor/:id", getDoctorById);

// Update a doctor
router.put("/update-doctor/:id", updateDoctor);

// Delete a doctor
router.delete("/delete-doctor/:id", deleteDoctor);

export default router;
