import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // Replace 'any' with your desired type if you have a specific user payload
    }
  }
}
