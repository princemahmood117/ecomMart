import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { adminOnly, protect } from "../middleware/auth.js";



const router = Router();

router.get("/stats", protect, adminOnly, async (_req, res) => {
  const totalUsers = await prisma.user.count({ where: { role: "CUSTOMER" } });
  const totalOrders = await prisma.order.count({ where: { isConfirmed: true } });

  const orders = await prisma.order.findMany({
    where: { isConfirmed: true, status: { not: "CANCELLED" } },
    select: { totalPrice: true, createdAt: true },
  });

  // Daily earnings (last 14 days)
  const dailyMap = new Map<string, number>();
  const monthlyMap = new Map<string, number>();

  orders.forEach((o) => {
    const day = o.createdAt.toISOString().slice(0, 10);
    const month = o.createdAt.toISOString().slice(0, 7);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + o.totalPrice);
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + o.totalPrice);
  });

  const daily = Array.from(dailyMap.entries()).sort().slice(-14).map(([date, total]) => ({ date, total }));
  const monthly = Array.from(monthlyMap.entries()).sort().slice(-12).map(([month, total]) => ({ month, total }));

  res.json({ totalUsers, totalOrders, daily, monthly });
});

export default router;