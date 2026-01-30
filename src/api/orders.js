import express from 'express';
import { Order } from '../infrastructure/entities/Order.js';

const router = express.Router();

// Route to Create a New Order
router.post('/', async (req, res) => {
  try {
    const { userId, customerName, customerEmail, items, totalAmount, paymentId } = req.body;

    const newOrder = await Order.create({
      userId,
      customerName,
      customerEmail,
      items,
      totalAmount,
      paymentId
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

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { 
        status: status,
        adminMessage: message,
        updatedAt: new Date()
      },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

export default router;