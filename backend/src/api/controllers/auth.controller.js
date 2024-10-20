import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import logger from "../../utils/logger.js";
import bcrypt from "bcrypt";
import genAuthToken from "../../utils/genAuthToken.js";
import { emailOrUsername } from "../../utils/helpers.js";
import AidCounter from "../models/AidCounter.js";
import { generateQRCode } from "../../utils/genQR.js";

const authController = {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        username,
        firstname,
        lastname,
        email,
        password,
        role,
        avatar,
        contact,
        DOB,
        gender,
      } = req.body;

      // Check if username or email already exists
      const userNameExists = await User.findOne({ username });
      if (userNameExists) {
        return res
          .status(400)
          .json({ message: "Username already exists", success: false });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return res
          .status(400)
          .json({ message: "User already exists", success: false });
      }

      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      console.log("Role being processed:", role);

      // Create user AID starting from A0001 if the role is 'user'
      let AID = null;
      if (role === "user") {
        // Ensure the AidCounter exists
        let aidCounter = await AidCounter.findOne();
        if (!aidCounter) {
          aidCounter = await AidCounter.create({ currentAID: 1 }); // Create the AidCounter with a starting value
          console.log(
            "Created AidCounter with currentAID:",
            aidCounter.currentAID
          );
        } else {
          // Increment the AID
          aidCounter = await AidCounter.findOneAndUpdate(
            {},
            { $inc: { currentAID: 1 } },
            { new: true }
          );
          console.log(
            "Updated AidCounter to currentAID:",
            aidCounter.currentAID
          );
        }

        // Format the AID (e.g., A0001, A0002, ...)
        AID = `A${String(aidCounter.currentAID).padStart(4, "0")}`; // Use currentAID instead of sequenceValue
        console.log("Generated AID:", AID);
      }

      const QRCode = await generateQRCode(AID, { width: 300 });

      const user = new User({
        username,
        firstname,
        lastname,
        email,
        password: hashedPassword,
        role,
        avatar,
        contact,
        AID,
        DOB,
        gender,
        created_date: new Date(),
        last_login: new Date(),
        QRCodeUrl: QRCode,
      });

      try {
        const savedUser = await user.save();
        savedUser.password = undefined;
        const token = genAuthToken(savedUser);

        res.status(201).json({ user: savedUser, token: token, success: true });
      } catch (error) {
        logger.error(error.message);
        res
          .status(500)
          .json({ success: false, message: "Internal server error" });
      }
    } catch (error) {
      logger.error(error.message);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  async login(req, res) {
    const { username, password } = req.body;

    const type = emailOrUsername(username);

    try {
      let user;
      if (type === "email") {
        user = await User.findOne({ email: username });
      } else {
        user = await User.findOne({ username: username });
      }

      if (!user) {
        logger.error(username, password);
        return res
          .status(400)
          .json({ sucess: false, message: "User not found" });
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid password" });
      }

      user.password = undefined;

      const token = genAuthToken(user);
      res.status(200).json({
        success: true,
        message: "Succesfully logged in",
        user: user,
        token: token,
      });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async checkAuth(req, res) {
    try {
      const user = await User.findById(req.user._id).select("-password");

      const { authorization } = req.headers;

      if (!authorization) {
        return res.status(401).json({ sucess: false, message: "Unauthorized" });
      }

      const token = authorization.split(" ")[1];

      res.status(200).json({ success: true, user: user, token: token });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ sucess: false, message: "Internal server error" });
    }
  },

  async logout(req, res) {
    try {
      // Clear the authentication token or session cookie
      res.clearCookie("token");

      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      logger.error("Logout error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default authController;
