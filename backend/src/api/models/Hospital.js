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
    default: "..../..../.Srilanka",
  },
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
