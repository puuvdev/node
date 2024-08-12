import { Schema, model, Document } from "mongoose";

// Define the interface for the Menu document
interface MenuInterface extends Document {
  name: string;
  slug: string;
  updated_at: {
    $date: Date;
  };
}

// Define the model name
const modelName = "Menu";

// Define the schema
const MenuSchema = new Schema<MenuInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
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
  },
  {
    collection: "menus", // Specify the collection name
  }
);

// Define and export the Menu model
const Menu = model<MenuInterface>(modelName, MenuSchema);
export default Menu;
