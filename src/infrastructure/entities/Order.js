import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  customerName: { type: String },
  customerEmail: { type: String },
  
  // 👇 ADD THIS
  customerPhone: { type: String }, 
  
  shippingAddress: {
    line1: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String, default: "Sri Lanka" }
  },
  items: [
    // ... items schema (keep as is)
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
  paymentId: { type: String, required: true }, 
  status: { type: String, default: "Processing" },
  adminMessage: { type: String },
  deliveredAt: { type: Date }, 
  thankYouEmailSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model("Order", OrderSchema);