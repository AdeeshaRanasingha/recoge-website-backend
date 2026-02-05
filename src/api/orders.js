import express from 'express';
import { Order } from '../infrastructure/entities/Order.js';

const router = express.Router();

// Inside router.post('/')
router.post('/', async (req, res) => {
  try {
    // 👇 Add customerPhone to destructuring
    const { userId, customerName, customerEmail, customerPhone, items, totalAmount, paymentId, shippingAddress } = req.body;

    const newOrder = await Order.create({
      userId,
      customerName,
      customerEmail,
      customerPhone, // 👇 Save it
      items,
      totalAmount,
      paymentId,
      shippingAddress
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    // Find orders for this user, sorted by newest first (-1)
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// GET ALL ORDERS (For Admin)
router.get("/", async (req, res) => {
  try {
    // Return all orders, newest first
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;

    // Prepare update object
    let updateData = {
      status: status,
      adminMessage: message,
      updatedAt: new Date()
    };

    // 👇 IF MARKING AS DELIVERED, SET TIMESTAMP
    if (status === "Delivered") {
        updateData.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedOrder) return res.status(404).json({ error: "Order not found" });
    res.json(updatedOrder);
  } catch (error) {
    // ... error handling
  }
});
export default router;