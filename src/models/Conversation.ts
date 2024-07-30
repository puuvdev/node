import { Schema, Document, model } from "mongoose";

interface Conversation extends Document {
  last_message_at: Date;
  name: string;
  read: boolean;
}

const ConversationSchema = new Schema<Conversation>(
  {
    last_message_at: { type: Date, required: true },
    name: { type: String, required: true },
    read: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    collection: "conversations",
  }
);

export default model<Conversation>("Conversation", ConversationSchema);
