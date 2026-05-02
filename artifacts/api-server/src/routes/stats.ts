import { Router, type Request, type Response, type NextFunction } from "express";
import { db, ordersTable, productsTable, cartItemsTable } from "@workspace/db";
import { sql, eq, gte } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(401).json({ error: "Chưa đăng nhập hoặc không có quyền truy cập" });
  }
  next();
}

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalRevenueRow] = await db
    .select({ total: sql<string>`COALESCE(SUM(total), 0)` })
    .from(ordersTable)
    .where(eq(ordersTable.status, "delivered"));

  const ordersByStatus = await db
    .select({
      status: ordersTable.status,
      count: sql<number>`COUNT(*)`,
    })
    .from(ordersTable)
    .groupBy(ordersTable.status);

  const [totalProductsRow] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(productsTable);

  const recentOrders = await db
    .select({
      date: sql<string>`DATE(created_at)`,
      revenue: sql<string>`COALESCE(SUM(total), 0)`,
      count: sql<number>`COUNT(*)`,
    })
    .from(ordersTable)
    .where(gte(ordersTable.createdAt, thirtyDaysAgo))
    .groupBy(sql`DATE(created_at)`)
    .orderBy(sql`DATE(created_at)`);

  const totalOrders = ordersByStatus.reduce((sum, row) => sum + Number(row.count), 0);

  res.json({
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
