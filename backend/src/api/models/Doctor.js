import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  specialization: { type: String, required: true },
  medicalLicenseNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  yearsOfExperience: { type: Number, required: true },
});

export default mongoose.model("Doctor", doctorSchema);
