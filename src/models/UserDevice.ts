import { Document, Schema, model } from "mongoose";

interface IDevice extends Document {
  deviceId: string;
  serialNumber: string;
  user_id: Schema.Types.ObjectId;
  created_at: Date;
  expired_at: Date;
}

const deviceSchema = new Schema<IDevice>(
  {
    deviceId: { type: String, required: true },
    serialNumber: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    created_at: { type: Date, required: true, default: Date.now },
    expired_at: {
      type: Date,
      required: true,
      default: function () {
        const createdAt = new Date();
        return new Date(createdAt.getTime() + 365 * 24 * 60 * 60 * 1000); // Add one year to created_at
      },
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    }, // Automatically adds createdAt and updatedAt fields
    collection: "user_devices",
  }
);

export default model<IDevice>("Device", deviceSchema);
