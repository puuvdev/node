import { Schema, Document, model } from "mongoose";

interface Order extends Document {
  isScheduled: boolean;
  shortCode: string;
  body: string;
  totalPrice: number;
  totalDiscountedPrice: number;
  doNotKnock: boolean;
  isEcoFriendly: boolean;
  paymentMethod: string;
  restaurantPanelOperation: string;
  pos_ticket: string;
  isConfirm: boolean;
  totalDiscount: number;
  dropOffAtDoor: boolean;
  status: string;
  confirmationId: string;
  client: string;
  courier: string;
  products: any[]; // Adjust the type as needed
  clientNote: string;
  deliveryType: string;
  paymentMethodText: string;
  posPaymentMethod: string;
  provider: string;
  restaurant: string;
  restaurantName: string;
  restaurantId: string;
  cancelNote: string;
  cancelReason: string;
  scheduledDate: Date;
  pid: string;
  draft: boolean;
  created_5min: Date;
  server_time: Date;
  confirmationCode: string;
  verify: boolean;
  cancel: boolean;
}

const OrderSchema = new Schema<Order>(
  {
    isScheduled: { type: Boolean, required: true },
    shortCode: { type: String, required: true },
    body: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    totalDiscountedPrice: { type: Number, required: true },
    doNotKnock: { type: Boolean, required: true },
    isEcoFriendly: { type: Boolean, required: true },
    paymentMethod: { type: String, required: true },
    restaurantPanelOperation: { type: String, required: true },
    pos_ticket: { type: String, required: true },
    isConfirm: { type: Boolean, required: true },
    totalDiscount: { type: Number, required: true },
    dropOffAtDoor: { type: Boolean, required: true },
    status: { type: String, required: true },
    confirmationId: { type: String, required: true },
    client: { type: String, required: true },
    courier: { type: String, required: true },
    products: [{ type: Schema.Types.Mixed }], // Adjust the type as needed
    clientNote: { type: String, required: true },
    deliveryType: { type: String, required: true },
    paymentMethodText: { type: String, required: true },
    posPaymentMethod: { type: String, required: true },
    provider: { type: String, required: true },
    restaurant: { type: String, required: true },
    restaurantName: { type: String, required: true },
    restaurantId: { type: String, required: true },
    cancelNote: { type: String, required: true },
    cancelReason: { type: String, required: true },
    scheduledDate: { type: Date, required: true },
    pid: { type: String, required: true },
    draft: { type: Boolean, required: true },
    created_5min: { type: Date, required: true },
    server_time: { type: Date, required: true },
    confirmationCode: { type: String, required: true },
    verify: { type: Boolean, required: true },
    cancel: { type: Boolean, required: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "orders",
  }
);

export default model<Order>("Order", OrderSchema);
