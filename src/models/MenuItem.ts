import { Schema, model, Document } from "mongoose";

// Define the interface for the MenuItem document
export interface MenuItemInterface extends Document {
  name: string;
  url: string;
  target: string;
  menu_id: string;
  ebeveyn: string | null;
  updated_at: {
    $date: Date;
  };
  created_at: {
    $date: Date;
  };
  image: string | null;
}

// Define the model name
const modelName = "MenuItem";

// Define the schema
const MenuItemSchema = new Schema<MenuItemInterface>(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
      enum: ["_self", "_blank"], // Example enum, you can adjust it based on your needs
    },
    menu_id: {
      type: String,
      required: true,
    },
    ebeveyn: {
      type: String,
      default: null,
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
    image: {
      type: String,
      default: null,
    },
  },
  {
    collection: "menu_items", // Specify the collection name
  }
);

// Define and export the MenuItem model
const MenuItem = model<MenuItemInterface>(modelName, MenuItemSchema);
export default MenuItem;
