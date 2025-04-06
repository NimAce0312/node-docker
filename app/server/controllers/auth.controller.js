import mongoose from "mongoose";
import User from "../models/user.model.js";
import { checkRequiredFields } from "../utils/function.required.js";

export const register = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (Object.keys(req.body).length === 0) {
      const error = new Error("Request body cannot be empty.");
      error.status = 400;
      throw error;
    }

    const requiredFields = [
      {
        name: "Username",
        field: "username",
      },
      {
        name: "Email",
        field: "email",
      },
      {
        name: "Password",
        field: "password",
      },
    ];
    checkRequiredFields(requiredFields, req.body);

    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      const error = new Error("User already exists.");
      error.status = 409;
      throw error;
    }

    await User.create(
      [
        {
          username,
          password,
          email,
          role,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: "Registration successful.",
    });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      const error = new Error("Request body cannot be empty.");
      error.status = 400;
      throw error;
    }

    const requiredFields = [
      {
        name: "Email or Username",
        field: "contact",
      },
      {
        name: "Password",
        field: "password",
      },
    ];
    checkRequiredFields(requiredFields, req.body);

    const { contact, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username: contact }, { email: contact }],
    });
    if (!existingUser) {
      const error = new Error("Invalid credentials.");
      error.status = 401;
      throw error;
    }

    const isMatch = await existingUser.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Invalid credentials.");
      error.status = 401;
      throw error;
    }

    const token = existingUser.getSignedToken();

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};
