import Hospital from "../models/Hospital.js";

// Create a new hospital
export const createHospital = async (req, res) => {
  try {
    const { hospitalType, hospitalName, hospitalId } = req.body;
    const newHospital = new Hospital({
      hospitalType,
      hospitalName,
      hospitalId,
    });
    await newHospital.save();
    res
      .status(201)
      .json({ message: "Hospital created successfully", data: newHospital });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating hospital", error: error.message });
  }
};

// Get all hospitals
export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.status(200).json(hospitals);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hospitals", error: error.message });
  }
};

// Get a hospital by ID
export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json(hospital);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching hospital", error: error.message });
  }
};

// Update a hospital
export const updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res
      .status(200)
      .json({ message: "Hospital updated successfully", data: hospital });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating hospital", error: error.message });
  }
};

// Delete a hospital
export const deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.status(200).json({ message: "Hospital deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting hospital", error: error.message });
  }
};
