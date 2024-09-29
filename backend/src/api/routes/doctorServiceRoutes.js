import express from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
  getAvailableDates,
} from "../controllers/doctorServiceController.js";

const router = express.Router();

// Create a new service
router.post("/create-service", createService);

// Get all services
router.get("/get-services", getAllServices);

// Get a service by ID
router.get("/get-service/:id", getServiceById);

// Update a service
router.put("/update-service/:id", updateService);

// Delete a service
router.delete("/delete-service/:id", deleteService);

// New route for getting available dates
router.get("/get-available-dates", getAvailableDates);

export default router;
