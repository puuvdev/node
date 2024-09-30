import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = `Hw/WA."d}D@*ch4n`; // Use environment variables in a real application

interface JwtPayload {
  id: number; // Adjust this based on your actual payload structure
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.sendStatus(401); // Unauthorized if no token

  try {
    const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;

    next();
  } catch (error) {
    res.sendStatus(403); // Forbidden if token is invalid
  }
};

export const authenticateWithToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) return res.sendStatus(401); // Unauthorized if no token

  try {
    if (
      token ===
      "6634c9ba4b41a1ffc60aaca3|bjJkVh4JqiHul8bkFN9L90h70hDoIC3AOZJiXVGX2941fe0b"
    ) {
      next();
    } else {
      throw new Error("forbidden");
    }
  } catch (error) {
    res.sendStatus(403); // Forbidden if token is invalid
  }
};
