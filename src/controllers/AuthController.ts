// src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
const SECRET_KEY = `Hw/WA."d}D@*ch4n`;

export const authWithToken = async (req: Request, res: Response) => {
  const { token }: { token: string } = req.body;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token is required", success: false });
  }

  try {
    // Verify the token and extract the payload
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string };

    // Find the user by ID extracted from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(401)
        .json({ message: "User not found", success: false });
    }

    // If the user is found, return the user data
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
      expired: true,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password }: { email: string; password: string } = req.body;
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({
      success: true,
      user,
      m: isPasswordValid,
      password,
      token,
      user_password: user.password,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid credentialsa" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      firstName,
      lastName,
      password,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword, "pasword", req.body);
    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      name: firstName,
      surname: lastName,
      level: "user",
      deviceId: "web",
    });

    // Save the user to the database
    await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: newUser.id }, SECRET_KEY, { expiresIn: "1h" });

    // Return success response with user data and token
    res.status(201).json({
      success: true,
      user: newUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
