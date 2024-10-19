import mongoose from "mongoose";

//Schema which stores the CancelledAppointments attributes in the Mongo Database

const cancelledAppointmentSchema = new mongoose.Schema({
  AID: {
    type: String,
    required: true,
  },
  patientName: { type: String, required: true },
  userEmail: {
    type: String,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  servicePrice: {
    type: Number,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  cancelledDate: {
    type: Date,
    required: true,
  },
  cancelledTime: {
    type: [String],
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

const CancelledAppointment = mongoose.model(
  "CancelledAppointment",
  cancelledAppointmentSchema
);

export default CancelledAppointment;
