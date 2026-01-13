import "dotenv/config";
import express from "express";
import productRouter from "./api/product.js";

import { connectDB } from "./infrastructure/db.js";
import cors from "cors";

const server = express();
server.use(express.json());
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
server.use(cors({ origin: allowedOrigin }));


server.use("/api/products", productRouter);



connectDB();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
