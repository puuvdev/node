import { Schema, model, Document, isValidObjectId } from "mongoose";

interface IPos extends Document {
  grant_type: string;
  id: string;
  host: string;
  port: string;
  name: string;
  username: string;
  password: string;
  client_id: string;
  client_secret: string;
  user: string;
  bayi: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expired_at: number;
  pin: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: any;
  type: string;
}

const posSchema = new Schema<IPos>(
  {
    id: { type: String, required: true },
    host: { type: String, required: true },
    port: { type: String, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    client_id: { type: String, required: true },
    client_secret: { type: String, required: true },
    refresh_token: { type: String, required: true },
    user: { type: String, ref: "User", required: true },
    access_token: { type: String, required: true },
    pin: { type: String, required: true },
    expired_at: { type: Number, required: true },
    bayi: { type: String, required: true },
    transactions: { type: Schema.Types.Mixed },
    type: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: "pos",
  }
);
posSchema.statics.updateByUserId = async function (
  userId: string,
  updateData: Partial<IPos>
): Promise<IPos | null> {
  if (isValidObjectId(userId)) {
    throw new Error("Invalid user ID format");
  }

  const updatedPos = await this.findOneAndUpdate({ user: userId }, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedPos;
};
const Pos = model<IPos>("Pos", posSchema);

export default Pos;
