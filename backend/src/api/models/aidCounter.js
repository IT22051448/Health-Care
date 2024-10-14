import mongoose from "mongoose";

//Automated AID counter to identify user's uniquely

const aidCounterSchema = new mongoose.Schema({
  currentAID: {
    type: Number,
    default: 1,
  },
});

const AidCounter = mongoose.model("AidCounter", aidCounterSchema);

export default AidCounter;
