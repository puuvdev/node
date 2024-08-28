import { Schema, model, Document } from "mongoose";

// Define the interface for the Feature document
interface FeatureInterface {
  name: string;
  value: string;
  order: number;
  text_index: string;
  text_index_slug: string;
  nameOfslug: string;
  valueOfSlug: string;
}

// Define the interface for the Category document
interface CategoryInterface {
  name: string;
  order: number;
  id: string;
}

// Define the interface for the Product document
export interface ProductInterface extends Document {
  title: string;
  providerId: number;
  category: CategoryInterface[];
  brand: string;
  images: string[];
  features: FeatureInterface[];
  updated_at: Date;
  created_at: Date;
}

const modelName = "Product";

// Define the schema for Feature
const FeatureSchema = new Schema<FeatureInterface>({
  name: { type: String, required: true },
  value: { type: String, required: true },
  order: { type: Number, required: true },
  text_index: { type: String, required: true },
  text_index_slug: { type: String, required: true },
  nameOfslug: { type: String, required: true },
  valueOfSlug: { type: String, required: true },
});

// Define the schema for Category
const CategorySchema = new Schema<CategoryInterface>({
  name: { type: String, required: true },
  order: { type: Number, required: true },
  id: { type: String, required: true },
});

// Define the schema for Product
const ProductSchema = new Schema<ProductInterface>(
  {
    title: { type: String, required: true },
    providerId: { type: Number, required: true },
    category: { type: [CategorySchema], required: true },
    brand: { type: String, required: true },
    images: { type: [String], required: true },
    features: { type: [FeatureSchema], required: true },
    updated_at: { type: Date, required: true, default: Date.now },
    created_at: { type: Date, required: true, default: Date.now },
  },
  {
    collection: "products",
  }
);

// Define and export the Product model
const Product = model<ProductInterface>(modelName, ProductSchema);
export default Product;
