const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
    required: true,
    unique: true,
  },
  hospitalType: {
    type: String,
    enum: ["Government", "Private"],
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    default: "Srilanka",
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs9mGa7d6TjMWpd-dsUD4Cea7E8wrJflA_kQ&s",
  },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
