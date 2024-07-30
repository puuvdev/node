import { Schema, Document, model, Model, Types } from "mongoose";

// Extend the Franchise interface to include the virtual property
interface Franchise extends Document {
  user_id: Types.ObjectId;
  franchise_id: Types.ObjectId;
}
interface FranchiseModel extends Model<Franchise> {
  aggregateWithUser(userId: string): Promise<any>;
}

const FranchiseSchema = new Schema<Franchise>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    franchise_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "franchises",
  }
);

FranchiseSchema.statics.aggregateWithUser = async function (userId: string) {
  const franchisesWithUser = await this.aggregate([
    {
      $match: {
        user_id: new Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "users", // Name of the users collection
        localField: "user_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        user_id: 1,
        franchise_id: 1,
        name: 1,
        user: {
          _id: 1,
          name: 1,
          token: 1,
          deviceId: 1,
        },
      },
    },
  ]);

  return franchisesWithUser;
};

export default model<Franchise, FranchiseModel>("Franchise", FranchiseSchema);
