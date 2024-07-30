// producer.ts

import ProducerFactory from "./ProducerFactory";
import { CustomMessageFormat } from "./MessageProcessor";

export async function runProducer(message: string) {
  const producerFactory = new ProducerFactory("request-topic");

  try {
    await producerFactory.start();

    // Example messages to send
    const messagesToSend: CustomMessageFormat[] = [{ message: "Message 1" }];

    // Send batch of messages
    await producerFactory.sendBatch(messagesToSend);
  } catch (error) {
    console.error("Error running producer:", error);
  } finally {
    await producerFactory.shutdown();
  }
}
