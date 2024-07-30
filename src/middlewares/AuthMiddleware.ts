import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET_KEY = `Hw/WA."d}D@*ch4n`; // Use environment variables in a real application

interface JwtPayload {
  id: number;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, SECRET_KEY) as JwtPayload;

    next(payload);
  } catch (error) {
    res.sendStatus(403);
  }
};
