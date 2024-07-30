import { Schema, model, Document } from "mongoose";

// Define the interface for the Order document
interface Filter extends Document {
  filters: { name: string; slug: string };
  name: string;
}

// Define the schema
const ProductSchema = new Schema<Filter>(
  {
    filters: {
      name: { type: String, required: true },
      slug: { type: String, required: true },
    },
    name: { type: String },
  },
  {
    collection: "category_filters",
  }
);

// Define and export the Order model
const ProductFilter = model<Filter>("CategoryFilter", ProductSchema);
export default ProductFilter;
