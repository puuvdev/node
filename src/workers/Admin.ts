import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "client-id",
  brokers: ["localhost:9092"],
});
const admin = kafka.admin();
export const connect = async (process: string) => {
  try {
    await admin.connect();
    if (process == "listTopics") {
      let topics = await admin.listTopics();
      return await admin.fetchTopicMetadata({ topics });
    }

    if (process == "listGroups") {
      let result = await admin.listGroups();
      return result;
    }
    if (process == "describeGroups") {
      let result = await admin.describeGroups(["consumer-group"]);
      return result;
    }
    if (process == "deleteTopicRecords") {
      let result = await admin.deleteTopicRecords({
        topic: "my_topic",
        partitions: [{ partition: 2, offset: "30" }],
      });
      return result;
    }
  } catch (error) {
    console.error("Error starting admin:", error);
  }
};
