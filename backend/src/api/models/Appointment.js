//Appointment Database inserted information for User

import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  hospital: {
    type: String,
    enum: ["government", "private"],
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  doctorName: {
    type: String,
    required: true,
  },
  appointmentDates: [
    {
      date: { type: Date, required: true },
      time: { type: String, required: true },
    },
  ],
  patient: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    description: { type: String, required: true },
  },
});

export default mongoose.model("Appointment", appointmentSchema);
