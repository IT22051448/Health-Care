import logger from "../../utils/logger.js";
import User from "../models/user.model.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

const userController = {
  async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      res.json(user);
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async updateUser(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Invalid" });
      }

      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const previousPassword = req.param.prevPassword;

      const isMatch = await bcrypt.compare(previousPassword, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

      user.name = req.body.name;
      user.firstname = req.body.firstname;
      user.lastname = req.body.lastname;
      user.email = req.body.email;
      user.password = hashedPassword;
      user.role = req.body.role;
      user.avatar = req.body.avatar;
      user.contact = req.body.contact;

      await user.save();
      res.json({ message: "User updated successfully" });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      await user.remove();
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      logger.error(error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  async scanQRCode(req, res) {
    try {
      const { AID } = req.body;

      if (!AID) {
        return res.status(400).json({ success: false, message: "Invalid AID" });
      }

      const user = await User.findOne({ AID: AID });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      user.lastVisited = new Date();
      const updatedUser = await user.save();

      res.status(200).json({
        success: true,
        message: "User visited successfully",
        user: updatedUser,
      });
    } catch (error) {
      logger.error(error.message);
    }
  },
};

export default userController;
