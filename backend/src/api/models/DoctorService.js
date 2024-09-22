import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  doctorName: { type: String, required: true },
  hospitalName: { type: String, required: true },
  services: [
    {
      serviceType: { type: String, required: true },
      serviceAmount: { type: Number, required: true },
      dates: [
        {
          date: { type: Date, required: true },
          times: [{ type: String, required: true }], // Array of time strings (e.g., "10:00 AM")
        },
      ],
    },
  ],
});

const DoctorService = mongoose.model("DoctorService", serviceSchema);

export default DoctorService;
