import mongoose from "mongoose";

//Schema which stores the DoctorServices attributes in the Mongo Database

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
          times: [{ type: String, required: true }],
        },
      ],
    },
  ],
});

const DoctorService = mongoose.model("DoctorService", serviceSchema);

export default DoctorService;
