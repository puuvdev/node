import {
  Kafka,
  Message,
  Partitioners,
  Producer,
  ProducerBatch,
  TopicMessages,
} from "kafkajs";
import { CustomMessageFormat } from "./MessageProcessor";

const generateCorrelationId = (): string =>
  Math.random().toString(36).substring(7);

export default class ProducerFactory {
  private producer: Producer;
  private topic: string;

  constructor(topic: string) {
    this.producer = this.createProducer();
    this.topic = topic;
  }

  public async start(): Promise<any> {
    try {
      const correlationId = generateCorrelationId();
      await this.producer.connect();
      return correlationId;
    } catch (error) {
      console.log("Error connecting the producer: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendBatch(messages: Array<CustomMessageFormat>): Promise<void> {
    const kafkaMessages: Array<Message> = messages.map((message) => {
      return {
        value: JSON.stringify(message.value),
        key: message.key.toString(),
      };
    });

    const topicMessages: TopicMessages = {
      topic: this.topic,
      messages: kafkaMessages,
    };

    const batch: ProducerBatch = {
      topicMessages: [topicMessages],
    };

    await this.producer.sendBatch(batch);
  }

  private createProducer(): Producer {
    const kafka = new Kafka({
      clientId: "producer-client",
      brokers: ["localhost:9092"],
    });

    return kafka.producer({
      createPartitioner: Partitioners.DefaultPartitioner,
    });
  }
}
