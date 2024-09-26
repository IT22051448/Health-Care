import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  hospital: {
    type: String,
    required: true,
  },
  isGovernment: {
    type: Boolean,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  patientDetails: {
    fullName: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
  },
  appointments: [
    {
      date: {
        type: Date,
        required: true,
      },
      time: {
        type: [String],
        required: true,
      },
    },
  ],
  payment: {
    amount: {
      type: Number,
      required: function () {
        return !this.isGovernment; // Only required if not a government hospital
      },
    },
    method: {
      type: String,
      enum: ["Card Payment", "Cash", "Insurance"],
      required: function () {
        return !this.isGovernment; // Only required if not a government hospital
      },
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: function () {
        return this.isGovernment ? "Completed" : "Pending"; // Completed if government
      },
    },
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
