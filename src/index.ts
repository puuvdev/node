import express from "express";
const api = express();
const port = process.env.PORT || 8080;
import cors from "cors";

const corsOptions = {
  origin: "*", // Replace with your client's origin
  methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  credentials: true, // Allow cookies to be sent
};
import apiRouter from "./routes/apiRoutes";
import mongoose from "mongoose";

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
api.use("/api/", apiRouter);
api.use(cors(corsOptions));
api.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

/*
// Run the consumer
runConsumer().catch((error) =>
  console.error("Unhandled error in consumer:", error)
);

// Graceful shutdown on SIGINT (Ctrl+C)
process.once("SIGINT", async () => {
  console.log("Shutting down consumer...");
  await consumer.shutdown();
  console.log("Consumer shut down.");
  process.exit(0);
});
*/
