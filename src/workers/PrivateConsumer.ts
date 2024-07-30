import {
  Consumer,
  ConsumerSubscribeTopics,
  EachBatchPayload,
  Kafka,
  EachMessagePayload,
} from "kafkajs";
import { ExampleMessageProcessor } from "./MessageProcessor"; // Adjust the path as necessary

export default class PrivateConsumer {
  private kafkaConsumer: Consumer;
  private messageProcessor: ExampleMessageProcessor;
  private isConsumerConnected: boolean;

  public constructor(messageProcessor: ExampleMessageProcessor) {
    this.messageProcessor = messageProcessor;
    this.kafkaConsumer = this.createKafkaConsumer();
    this.isConsumerConnected = false;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.kafkaConsumer.on(this.kafkaConsumer.events.DISCONNECT, async () => {
      this.isConsumerConnected = false;
      console.log("Consumer disconnected. Attempting to reconnect...");
      await this.reconnect();
    });

    this.kafkaConsumer.on(this.kafkaConsumer.events.CONNECT, () => {
      this.isConsumerConnected = true;
      console.log("Consumer connected.");
    });
  }

  private async reconnect() {
    const maxRetries = 5;
    let attempt = 0;

    while (attempt < maxRetries && !this.isConsumerConnected) {
      try {
        await this.startConsumer(); // Reconnect and restart the consumer
        console.log("Consumer reconnected.");
      } catch (error) {
        attempt++;
        console.error(`Reconnect attempt ${attempt} failed:`, error);
        await this.delay(5000); // Wait for 5 seconds before retrying
      }
    }

    if (!this.isConsumerConnected) {
      console.error(
        "Max reconnection attempts reached. Could not reconnect consumer."
      );
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  public async startConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: ["my_topic"],
      fromBeginning: false,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload;
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;

          console.log({
            prefix,
            message,
          });
        },
      });
    } catch (error) {
      this.isConsumerConnected = false;
      console.error("Error in startConsumer:", error);
      console.log("Error: ", error);
    }
  }

  public async startBatchConsumer(): Promise<void> {
    const topic: ConsumerSubscribeTopics = {
      topics: ["my_topic"],
      fromBeginning: false,
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);
      await this.kafkaConsumer.run({
        eachBatch: async (eachBatchPayload: EachBatchPayload) => {
          const { batch, resolveOffset, heartbeat } = eachBatchPayload;
          for (const message of batch.messages) {
            const prefix = `${batch.topic}[${batch.partition} |  highWatermark: ${batch.highWatermark} | ${message.offset}] / ${message.timestamp}`;

            console.log({
              prefix,
              message: {
                value: message.value
                  ? JSON.parse(message.value.toString())
                  : "",
                key: message.key?.toString(),
              },
            });
            resolveOffset(message.offset);
            //await heartbeat();
          }
        },
      });
    } catch (error) {
      this.isConsumerConnected = false;
      console.log("Error: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.kafkaConsumer.disconnect();
  }

  private createKafkaConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: "client-id",
      brokers: ["localhost:9092"],
    });
    const consumer = kafka.consumer({ groupId: "consumer-group" });
    const { HEARTBEAT, CRASH, REQUEST } = consumer.events;
    consumer.on(HEARTBEAT, (e) =>
      console.log(`heartbeat at ${e.timestamp} ${e.payload}`, e.payload)
    );
    consumer.on(CRASH, (e) => console.log(e.payload));
    consumer.on(REQUEST, (e) => console.log(e.payload));

    return consumer;
  }
}
