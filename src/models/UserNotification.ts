import { Schema, model, Document } from "mongoose";
import { IUser } from "./User";
import { IUserAlarm } from "./UserAlarm";

interface NotificationInterface {
  type: string; // e.g., "Price Drop", "Price Increase", "General Alert"
  message: string;
  isRead: boolean;
}

export interface IUserNotification extends Document {
  user: IUser["_id"]; // Reference to User
  alarm: IUserAlarm["_id"]; // Reference to UserAlarm
  notification: NotificationInterface;
  createdAt: Date;
  updatedAt: Date;
}

const userNotificationSchema = new Schema<IUserNotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    alarm: { type: Schema.Types.ObjectId, ref: "UserAlarm", required: true },
    notification: {
      type: { type: String, required: true },
      message: { type: String, required: true },
      isRead: { type: Boolean, required: true, default: false },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: "user_notifications",
  }
);

const UserNotification = model<IUserNotification>(
  "UserNotification",
  userNotificationSchema
);

export default UserNotification;
