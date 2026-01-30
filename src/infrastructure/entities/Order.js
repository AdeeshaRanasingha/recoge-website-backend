import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  customerName: { type: String },
  customerEmail: { type: String },
  items: [
    {
      productId: String,
      title: String,
      quantity: Number,
      price: Number,
      size: String,
      color: String,
      image: String
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentId: { type: String, required: true }, // Stripe Payment Intent ID
  status: { type: String, default: "Processing" },
  adminMessage: { type: String }, // <--- ADD THIS
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model("Order", OrderSchema);