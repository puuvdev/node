import express, { Application, Request, Response, NextFunction } from "express";
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

  callback(null, corsOptions); // Pass the options to the callback
};

// Use the CORS middleware with dynamic options
api.use(cors(corsOptionsDelegate));
import {
  authenticateJWT,
  authenticateWithToken,
} from "./middlewares/AuthMiddleware";
import apiRouter from "./routes/apiRoutes";
import mongoose from "mongoose";
import { login, authWithToken } from "./controllers/AuthController";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://mongo:7f7c8b0ec3a9264da6de@78.135.107.15:2333/puuv_v1?authSource=admin";

mongoose
  .connect(MONGO_URI, {})
  .then(() => {})
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

console.log("Connected to MongoDB");
api.use(express.json());
api.use("/api/", authenticateWithToken, apiRouter);
api.use("/user/", authenticateJWT, apiRouter);
api.post("/login", login);
api.post("/authWithToken", authWithToken);

api.get("/status", async (req: Request, res: Response) => {
  res.json({ success: true, git: "test" });
});
api.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
