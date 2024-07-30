import ProducerFactory from "../workers/ProducerFactory";
import { CustomMessageFormat } from "../workers/MessageProcessor";
import { Request, Response } from "express";
import { connect } from "../workers/Admin";
export const admin = async (req: Request, res: Response) => {
  if (req.params.process) {
    let process: string = req.params.process;
    let result = await connect(process).catch((error) =>
      console.error("admin:", error)
    );
    return res.json(result);
  }
};
export const wh = async (req: Request, res: Response) => {
  const producerFactory = new ProducerFactory("request-topic");
  const order = req.body;
  try {
    await producerFactory.start();
    const messagesToSend: CustomMessageFormat[] = [
      { value: "hello", key: order.code },
    ];
    await producerFactory.sendBatch(messagesToSend);
  } catch (error) {
    console.error("Error running producer:", error);
  } finally {
    await producerFactory.shutdown();
  }

  // Send order status to Kafka

  return res.json({ success: true });
};
