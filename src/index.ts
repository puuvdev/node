import express, { Application, Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
dotenv.config();
const api = express();
const port = process.env.PORT || 8888;
import cors, { CorsOptions } from "cors";
const allowedOrigins = ["https://canavar.net"];

const corsOptionsDelegate = (
  req: Request,
  callback: (err: Error | null, options?: CorsOptions) => void
) => {
  let corsOptions: CorsOptions = { origin: false };
  const origin = req.header("Origin");
  console.log(origin, req.headers, "origin");

  if (origin && allowedOrigins.includes(origin)) {
    corsOptions = { origin: true };
    callback(null, corsOptions);
  } else {
    callback(new Error("zangir zungur"), corsOptions);
  }
};

import {
  authenticateJWT,
  authenticateWithToken,
} from "./middlewares/AuthMiddleware";
import apiRouter from "./routes/apiRoutes";
import mongoose from "mongoose";
import { login, authWithToken } from "./controllers/AuthController";
import { error } from "console";

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
api.use(cors(corsOptionsDelegate));
api.use(express.json());
api.use("/api/", [authenticateWithToken, cors(corsOptionsDelegate)], apiRouter);
api.use("/user/", authenticateJWT, apiRouter);
api.post("/login", login);
api.post("/authWithToken", authWithToken);

api.get("/status", async (req: Request, res: Response) => {
  res.json({ success: true, git: "test" });
});
api.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
