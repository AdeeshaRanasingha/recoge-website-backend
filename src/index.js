import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./infrastructure/db.js";
import stripeRoutes from './application/stripe.js';
import orderRouter from "./api/orders.js";

// Import your routers
import productRouter from "./api/product.js";
import whatsappRouter from "./api/whatsapp.js"; // <--- Import the new file
import analyticsRouter from "./api/analytics.js";

const server = express();
server.use(express.json());

const allowedOrigins = (process.env.FRONTEND_URLS || "http://localhost:5173,https://recoge.netlify.app").split(',');
server.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// --- ROUTES ---
server.use("/api/products", productRouter);

// Mount the WhatsApp router at "/api"
// This preserves your endpoint URL as: /api/send-whatsapp
server.use("/api", whatsappRouter); 
server.use('/api/stripe', stripeRoutes);
server.use("/api/orders", orderRouter);
server.use("/api/analytics", analyticsRouter);

// --- SERVER START ---
connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});