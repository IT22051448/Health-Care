import DoctorService from "../models/DoctorService.js";

// Create a new service
export const createService = async (req, res) => {
  try {
    const { doctorName, hospitalName, services } = req.body;

    const newService = new DoctorService({
      doctorName,
      hospitalName,
      services,
    });

    await newService.save();
    res
      .status(201)
      .json({ message: "Service created successfully", data: newService });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating service", error: error.message });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await DoctorService.find();
    res.status(200).json(services);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
};

// Get a service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await DoctorService.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching service", error: error.message });
  }
};

// Update a service
export const updateService = async (req, res) => {
  try {
    const service = await DoctorService.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res
      .status(200)
      .json({ message: "Service updated successfully", data: service });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating service", error: error.message });
  }
};

// Delete a service
export const deleteService = async (req, res) => {
  try {
    const service = await DoctorService.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
};
