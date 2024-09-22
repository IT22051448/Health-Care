import express from "express";
import {
  createHospital,
  getAllHospitals,
  getHospitalById,
  updateHospital,
  deleteHospital,
} from "../controllers/HospitalController.js";

const router = express.Router();

// Create a new hospital
router.post("/create-hospital", createHospital);

// Get all hospitals
router.get("/get-hospitals", getAllHospitals);

// Get a hospital by ID
router.get("/get-hospital/:id", getHospitalById);

// Update a hospital
router.put("/update-hospital/:id", updateHospital);

// Delete a hospital
router.delete("/delete-hospital/:id", deleteHospital);

export default router;
