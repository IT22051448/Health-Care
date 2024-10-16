import mongoose from "mongoose";

//Schema which stores the appointments attributes in the Mongo Database

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
      enum: ["Pending", "Completed", "Rejected"],
      default: function () {
        return this.isGovernment ? "Completed" : "Pending"; // Completed if government
      },
    },
  },
  userEmail: {
    type: String,
    required: true,
  },
  AID: {
    type: String,
    required: true,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
