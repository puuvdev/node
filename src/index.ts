import express, { Application, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config();
const api = express();
const port = process.env.PORT || 8080;
import cors, { CorsOptions } from "cors";
const allowedOrigins = ["http://localhost:3001", "https://puuv.net"];

const corsOptionsDelegate = (
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void
) => {
  let corsOptions: CorsOptions = { origin: false }; // Default to not allow
  const origin = req.header("Origin");

  if (origin && allowedOrigins.includes(origin)) {
    corsOptions = { origin: true }; // Reflect (enable) the requested origin in the CORS response
  }
  console.log(origin, "origin");
  callback(null, corsOptions); // Pass the options to the callback
};

// Use the CORS middleware with dynamic options

import {
  authenticateJWT,
  authenticateWithToken,
} from "./middlewares/AuthMiddleware";
import apiRouter from "./routes/apiRoutes";
import mongoose from "mongoose";
import { login, authWithToken } from "./controllers/AuthController";

const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI) {
  try {
    mongoose
      .connect(MONGO_URI, {})
      .then(() => {})
      .catch((error) => {
        console.error("Error connecting to MongoDB", error);
      });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error, "try catch");
  }
}

api.use(express.json());
api.use("/api/", authenticateWithToken, apiRouter);
api.use("/user/", authenticateJWT, apiRouter);
api.post("/login", login);
api.post("/authWithToken", authWithToken);

api.use(cors(corsOptionsDelegate));

api.get("/status", async (req: Request, res: Response) => {
  res.json({ success: true, git: "test" });
});
api.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
