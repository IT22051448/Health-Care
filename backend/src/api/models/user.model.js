import mongoose from "mongoose";
const Schema = mongoose.Schema;

// define an user schema for a typical ecommerce customer and backend staff user
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  avatar: {
    type: String,
  },
  contact: {
    type: String,
  },
  gender: {
    type: String,
  },
  DOB: {
    type: Date,
  },
  created_date: {
    type: Date,
    required: true,
  },

  last_login: {
    type: Date,
  },
  AID: {
    type: String,
    unique: true,
  },
  QRCodeUrl: {
    type: String,
    required: true,
  },
  lastVisited: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
