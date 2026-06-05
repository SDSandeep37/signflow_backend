import * as User from "../models/userModel.js";
import { hashPassword } from "../utils/password.js";
import {
  emailValidator,
  nameValidator,
  passwordValidator,
} from "../utils/validator.js";

import jsonwebtoken from "jsonwebtoken";
import { createTokenCookie, destroyTokenCookie } from "../utils/cookies.js";

export async function registerUser(request, response) {
  try {
    if (!request.body) {
      return response.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }
    const { name, email, password } = request.body;
    if (!name || !nameValidator(name)) {
      return response
        .status(400)
        .json({ success: false, message: "Valid name is required" });
    }
    if (!email || !emailValidator(email)) {
      return response
        .status(400)
        .json({ success: false, message: "Valid email is required" });
    }
    if (!password || !passwordValidator(password)) {
      return response.status(400).json({
        success: false,
        message:
          "Password must contain combination of uppercase,lowercase,number,symbol and minimum 6 letters",
      });
    }
    const hashedPassword = await hashPassword(password);

    const user = await User.createUser(name, email, hashedPassword);
    if (!user) {
      return response
        .status(500)
        .json({ success: false, message: "Failed to create user" });
    }

    // Generate JWT token
    const token = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    );

    //store token in httpOnly cookie
    const maxAge = process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN) * 1000 * 60 * 60
      : 3600000; // default to 1 hour

    createTokenCookie(response, token, maxAge);
    // Send success response with user data and token
    response.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    if (error.code === "23505" && error.constraint === "users_email_key") {
      return response.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }
    console.error("Error registering user:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

export async function loginUser(request, response) {
  try {
    if (!request.body) {
      return response.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }
    const { email, password } = request.body;
    if (!email || !emailValidator(email)) {
      return response
        .status(400)
        .json({ success: false, message: "Valid email is required" });
    }
    if (!password) {
      return response.status(400).json({
        success: false,
        message: "Password is required",
      });
    }
    const user = await User.findUserByEmailPassword(email, password);
    if (!user) {
      return response
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jsonwebtoken.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" },
    );

    //store token in httpOnly cookie
    const maxAge = process.env.JWT_EXPIRES_IN
      ? parseInt(process.env.JWT_EXPIRES_IN) * 1000 * 60 * 60
      : 3600000; // default to 1 hour

    createTokenCookie(response, token, maxAge);
    // Send success response with user data and token
    response.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

// logout function
export async function logoutUser(request, response) {
  try {
    destroyTokenCookie(response);
    response.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error logging out user:", error);
    response
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}
