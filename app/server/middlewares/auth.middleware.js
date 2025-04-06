import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { decrypt } from "../utils/function.encryption.js";
import User from "../models/user.model.js";

export const protectedRoute = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else {
      return res.status(401).json({
        success: false,
        error: "Token is missing.",
      });
    }

    const decodedToken = jwt.verify(token, JWT_SECRET);
    decodedToken.id = decrypt(decodedToken.id);

    const existingUser = await User.findById(decodedToken.id);
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        error: "Invalid token.",
      });
    }

    req.token = decodedToken;
    req.user = existingUser;

    next();
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Not enough permission.",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
