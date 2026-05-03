import { Router } from "express";
import { db, ordersTable, productsTable } from "@workspace/db";
import { sql, eq, gte } from "drizzle-orm";

const router = Router();

function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(401).json({ error: "Chưa đăng nhập hoặc không có quyền truy cập" });
  }
  return next();
}

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalRevenueRow] = await db
    .select({ total: sql`COALESCE(SUM(total), 0)` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "delivered"));

  const ordersByStatus = await db
    .select({
      status: ordersTable.status,
      count: sql`COUNT(*)`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  const [totalProductsRow] = await db
    .select({ count: sql`COUNT(*)` })
    .from(productsTable);

  const recentOrders = await db
    .select({
      date: sql`DATE(created_at)`,
      revenue: sql`COALESCE(SUM(total), 0)`,
      count: sql`COUNT(*)`,
    })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, thirtyDaysAgo))
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`);

  const totalOrders = ordersByStatus.reduce((sum, row) => sum + Number(row.count), 0);

  return res.json({
    totalRevenue: Number(totalRevenueRow?.total ?? 0),
    totalOrders,
    totalProducts: Number(totalProductsRow?.count ?? 0),
    ordersByStatus: ordersByStatus.map((r) => ({
      status: r.status,
      count: Number(r.count),
    })),
    revenueByDay: recentOrders.map((r) => ({
      date: r.date,
      revenue: Number(r.revenue),
      count: Number(r.count),
    })),
  });
});

export default router;
