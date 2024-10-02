import mongoose from "mongoose";

const aidCounterSchema = new mongoose.Schema({
  currentAID: {
    type: Number,
    default: 1,
  },
});

const AidCounter = mongoose.model("AidCounter", aidCounterSchema);

export default AidCounter;
