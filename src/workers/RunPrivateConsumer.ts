import { MessageProcessor } from "./MessageProcessor";
import PrivateSyncConsumer from "./PrivateSyncConsumer";

const generateCorrelationId = () => Math.random().toString(36).substring(7);
const correlationId = generateCorrelationId();
const messageProcessor = new MessageProcessor();
const consumer = new PrivateSyncConsumer(messageProcessor, correlationId);

async function runConsumer() {
  try {
    await consumer.startBatchConsumer();
    console.log("Consumer started successfully.");
  } catch (error) {
    console.error("Error starting consumer:", error);
  }
}

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
