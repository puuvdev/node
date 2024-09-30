import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  token: string;
  deviceId: string;
  password: string;
  email_verified_at?: Date;
  remember_token?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    token: { type: String, required: true },
    deviceId: { type: String, required: true },
    password: { type: String, required: true },
    email_verified_at: { type: Date },
    remember_token: { type: String },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    collection: "users",
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password; // Remove password from the JSON response
    delete ret.remember_token; // Remove remember_token from the JSON response
    return ret;
  },
});

const User = model<IUser>("User", userSchema);

export default User;
