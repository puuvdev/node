import { Schema, model, Document } from "mongoose";

// Define the interface for the HeroSlider document
interface CompInterface extends Document {
  name: string;
  slug: string;
  description: string;
  props: any;
  type: string;
}

// Define the schema for HeroSlider
const ComponentSchema = new Schema<CompInterface>(
  {
    name: { type: String, required: true, default: "Hero Slider" },
    slug: { type: String, required: true, default: "HeroSlider" },
    description: { type: String, default: "" },
    props: { type: Schema.Types.Mixed, required: true }, // Using Mixed type for flexible schema
    type: { type: String, required: true, default: "swipper" },
  },
  {
    collection: "components", // Specify the collection name
  }
);

// Define and export the HeroSlider model
const HeroSlider = model<CompInterface>("Component", ComponentSchema);
export default HeroSlider;
