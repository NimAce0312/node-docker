import bcrypt from "bcryptjs";
import { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME } from "../config/env.js";
import User from "../models/user.model.js";

const createDefaultUser = async () => {
  try {
    let userExists = await User.findOne({
      username: ADMIN_USERNAME,
      email: ADMIN_EMAIL,
    });

    if (!userExists) {
      await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });

      console.log("Admin created.");
    }
  } catch (err) {
    console.log(err.message);
  }
};

export default createDefaultUser;
