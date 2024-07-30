import { Schema, model, Document } from "mongoose";

interface ModelInterFace extends Document {
  name: string;
  order: number;
  hasChildren: boolean;
  parent_id: string;
  updated_at: {
    $date: string; // ISO date string
  };
  created_at: {
    $date: string; // ISO date string
  };
  slug: string;
}
const modelName = "SubCategory";
// Define the schema
const ModelSchema = new Schema<ModelInterFace>(
  {
    name: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    hasChildren: {
      type: Boolean,
      required: true,
    },
    parent_id: {
      type: String,
      required: true,
    },
    updated_at: {
      $date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    created_at: {
      $date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
    slug: {
      type: String,
      required: true,
    },
  },
  {
    collection: "sub_categories",
  }
);

// Define and export the Order model
const Model = model<ModelInterFace>(modelName, ModelSchema);
export default Model;
