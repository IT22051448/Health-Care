import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  specialization: { type: String, required: true },
  medicalLicenseNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  yearsOfExperience: { type: Number },
  image: {
    type: String,
    default:
      "https://e7.pngegg.com/pngimages/226/524/png-clipart-physician-computer-icons-medicine-doctor-s-medical-medical-equipment-thumbnail.png",
  },
});

export default mongoose.model("Doctor", doctorSchema);
