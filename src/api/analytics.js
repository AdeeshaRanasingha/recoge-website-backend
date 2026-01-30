import express from 'express';
import { Order } from '../infrastructure/entities/Order.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // 1. Calculate Totals (Revenue & Count)
    const totals = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 }
        }
      }
    ]);

    const revenue = totals[0]?.totalRevenue || 0;
    const ordersCount = totals[0]?.totalOrders || 0;
    const avgOrderValue = ordersCount > 0 ? Math.round(revenue / ordersCount) : 0;

    // 2. Get Data for "Sales Last 7 Days" Chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesChart = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%m-%d", date: "$createdAt" } }, // Format: MM-DD
          sales: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } } // Sort by date ascending
    ]);

    // 3. Get Recent 5 Orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName totalAmount status createdAt");

    res.json({
      revenue,
      orders: ordersCount,
      avgOrderValue,
      salesChart,
      recentOrders
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;