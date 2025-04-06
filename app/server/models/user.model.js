import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import { encrypt } from "../utils/function.encryption.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."],
      unique: [true, "Username already exists."],
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores.",
      ],
      minlength: [3, "Username must be at least 3 characters."],
      maxLength: [50, "Username must be at most 50 characters."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email already exists."],
      trim: true,
      lowercase: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address."],
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.getSignedToken = function () {
  return jwt.sign(
    {
      id: encrypt(this._id),
      username: this.username,
      role: this.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    },
  );
};

const User = mongoose.model("User", userSchema);

export default User;
