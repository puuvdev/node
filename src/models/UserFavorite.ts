import { Schema, model, Document } from "mongoose";
import { IUser } from "./User";
import { ProductInterface } from "./Product";

export interface IUserFavorite extends Document {
  user: IUser["_id"]; // Reference to User
  product: ProductInterface["_id"]; // Reference to Product
  createdAt: Date;
}

const userFavoriteSchema = new Schema<IUserFavorite>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Track creation time
    collection: "user_favorites",
  }
);

const UserFavorite = model<IUserFavorite>("UserFavorite", userFavoriteSchema);

export default UserFavorite;
