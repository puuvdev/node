import { Schema, model, Document } from "mongoose";

// Define the interface for the Order document
interface ModelInterFace extends Document {
  name: string;
  order: number;
  updated_at: {
    $date: Date;
  };
  created_at: {
    $date: Date;
  };
  slug: string;
}
const modelName = "Category";
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
    collection: "categories",
  }
);

// Define and export the Order model
const Model = model<ModelInterFace>(modelName, ModelSchema);
export default Model;
