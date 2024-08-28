import { Schema, model, Document } from "mongoose";
import { IUser } from "./User";
import { ProductInterface } from "./Product";

interface AlarmInterface {
  time: Date;
  message: string;
  isActive: boolean;
}

export interface IUserAlarm extends Document {
  user: IUser["_id"]; // Reference to User
  product: ProductInterface["_id"]; // Reference to Product
  alarm: AlarmInterface;
  createdAt: Date;
  updatedAt: Date;
}

const userAlarmSchema = new Schema<IUserAlarm>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    alarm: {
      time: { type: Date, required: true },
      message: { type: String, required: true },
      isActive: { type: Boolean, required: true, default: true },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: "user_alarms",
  }
);

const UserAlarm = model<IUserAlarm>("UserAlarm", userAlarmSchema);

export default UserAlarm;
