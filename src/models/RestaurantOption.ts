import { Schema, Document, model } from "mongoose";

interface RestaurantOption extends Document {
  restaurant_id: string;
  provider: string;
  settings: any; // Adjust the type as needed
  integration: any; // Adjust the type as needed
  general: any; // Adjust the type as needed
  portions: any; // Adjust the type as needed
  varlikAdiFormati: string;
  adisyonNotuFormati: string;
  isEcoFriendly: boolean;
  doNotKnock: boolean;
  dropOffAtDoor: boolean;
  otomatikOnay: boolean;
  name: string;
  slug: string;
  service: string;
  yogun: boolean;
  status: string;
  kurye: string;
}

const RestaurantOptionSchema = new Schema<RestaurantOption>(
  {
    restaurant_id: { type: String, required: true },
    provider: { type: String, required: true },
    settings: { type: Schema.Types.Mixed, required: true }, // Adjust the type as needed
    integration: { type: Schema.Types.Mixed, required: true }, // Adjust the type as needed
    general: { type: Schema.Types.Mixed, required: true }, // Adjust the type as needed
    portions: { type: Schema.Types.Mixed, required: true }, // Adjust the type as needed
    varlikAdiFormati: { type: String, required: true },
    adisyonNotuFormati: { type: String, required: true },
    isEcoFriendly: { type: Boolean, required: true },
    doNotKnock: { type: Boolean, required: true },
    dropOffAtDoor: { type: Boolean, required: true },
    otomatikOnay: { type: Boolean, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    service: { type: String, required: true },
    yogun: { type: Boolean, required: true },
    status: { type: String, required: true },
    kurye: { type: String, required: true },
  },
  {
    collection: "restaurant_options",
  }
);

export default model<RestaurantOption>(
  "RestaurantOption",
  RestaurantOptionSchema
);
