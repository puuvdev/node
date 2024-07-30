import { Schema, model, Document } from "mongoose";

// Define interfaces for the nested objects
interface Meta {
  title: string;
  description: string;
  keywords: string;
  image: string;
  robots: string;
}

interface SEO {
  meta: Meta;
}

// Main Page interface extending Document
interface PageDocument extends Document {
  name: string;
  slug: string;
  module: string;
  isDelete: boolean;
  route: string;
  seo: SEO;
  components: string[];
  components_props: { [key: string]: any };
}

// Define schemas for nested objects
const MetaSchema = new Schema<Meta>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  keywords: { type: String, default: "" },
  image: { type: String, default: "" },
  robots: { type: String, default: "" },
});

const SEOSchema = new Schema<SEO>({
  meta: { type: MetaSchema, required: true },
});

// Main Page schema
const PageSchema = new Schema<PageDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    module: { type: String, required: true },
    isDelete: { type: Boolean, required: true, default: false },
    route: { type: String, required: true },
    seo: { type: SEOSchema, required: true },
    components: { type: [String], required: true },
    components_props: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: "pages",
  }
);

// Create and export the model
const PageModel = model<PageDocument>("Page", PageSchema);
export default PageModel;
