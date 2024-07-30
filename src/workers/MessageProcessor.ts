// ExampleMessageProcessor.ts

import { EachMessagePayload } from "kafkajs";

export interface ExampleMessageProcessor {
  processMessage(payload: EachMessagePayload): Promise<void>;
}

export interface CustomMessageFormat {
  [key: string]: string;
}

export class MessageProcessor implements ExampleMessageProcessor {
  async processMessage(payload: EachMessagePayload): Promise<void> {
    const { topic, partition, message } = payload;
    const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
  }
}
