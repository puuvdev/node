import express from "express";
const api = express();
const port = process.env.PORT || 3000;

import apiRouter from "./routes/apiRoutes";
import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://posentegra:UBN7pDcp4hwgNinB@pentegra.vcv24.mongodb.net/pentegrav2";

mongoose
  .connect(MONGO_URI, {
    // useNewUrlParser: true,
    //useUnifiedTopology: true,
  })
  .then(() => {})
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

console.log("Connected to MongoDB");
api.use(express.json());
api.use("/api/", apiRouter);

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
