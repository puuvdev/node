// src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";
const SECRET_KEY = `Hw/WA."d}D@*ch4n`;

export const authWithToken = async (req: Request, res: Response) => {
  const { token }: { token: string } = req.body;

  if (!token) {
    return res.status(401).json({ message: "user not found", success: false });
  }

  const user = await User.findOne({
    token,
  });
  if (!user) {
    return res.status(401).json({ message: "user not found", success: false });
  }

  res.json({
    success: true,
    user,
  });
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
