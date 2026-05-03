import { Router } from "express";
import { db, ordersTable, productsTable, warrantiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  AdminUpdateOrderStatusBody,
  AdminUpdateOrderStatusParams,
  AdminCreateProductBody,
  AdminUpdateProductParams,
  AdminUpdateProductBody,
  AdminDeleteProductParams,
  AdminCreateWarrantyBody,
  AdminUpdateWarrantyParams,
  AdminUpdateWarrantyBody,
  AdminDeleteWarrantyParams,
} from "@workspace/api-zod";

const router = Router();

function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.role !== "admin") {
    return res.status(401).json({ error: "Chưa đăng nhập hoặc không có quyền truy cập" });
  }
  return next();
}

router.use("/admin", requireAdmin);

router.get("/admin/orders", async (_req, res) => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  return res.json(orders.map(o => ({
    ...o,
    total: Number(o.total),
    createdAt: o.createdAt.toISOString(),
  })));
});

router.put("/admin/orders/:id/status", async (req, res) => {
  const paramsParsed = AdminUpdateOrderStatusParams.safeParse(req.params);
  const bodyParsed = AdminUpdateOrderStatusBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  }
  const [updated] = await db
    .update(ordersTable)
    .set({ status: bodyParsed.data.status })
    .where(eq(ordersTable.id, paramsParsed.data.id))
    .returning();
  if (!updated) return res.status(404).json({ error: "Không tìm thấy đơn hàng" });
  return res.json({ ...updated, total: Number(updated.total), createdAt: updated.createdAt.toISOString() });
});

router.post("/admin/products", async (req, res) => {
  const parsed = AdminCreateProductBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  const { price, originalPrice, ...rest } = parsed.data;
  const [product] = await db
    .insert(productsTable)
    .values({ ...rest, price: String(price), originalPrice: originalPrice ? String(originalPrice) : null })
    .returning();
  return res.status(201).json({ ...product, price: Number(product.price), originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined });
});

router.put("/admin/products/:id", async (req, res) => {
  const paramsParsed = AdminUpdateProductParams.safeParse(req.params);
  const bodyParsed = AdminUpdateProductBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  const { price, originalPrice, ...rest } = bodyParsed.data;
  const updateData = { ...rest };
  if (price !== undefined) updateData.price = String(price);
  if (originalPrice !== undefined) updateData.originalPrice = String(originalPrice);
  const [product] = await db.update(productsTable).set(updateData).where(eq(productsTable.id, paramsParsed.data.id)).returning();
  if (!product) return res.status(404).json({ error: "Không tìm thấy sản phẩm" });
  return res.json({ ...product, price: Number(product.price), originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined });
});

router.delete("/admin/products/:id", async (req, res) => {
  const parsed = AdminDeleteProductParams.safeParse(req.params);
  if (!parsed.success) return res.status(400).json({ error: "ID không hợp lệ" });
  await db.delete(productsTable).where(eq(productsTable.id, parsed.data.id));
  return res.json({ success: true });
});

router.get("/admin/warranties", async (_req, res) => {
  const warranties = await db.select().from(warrantiesTable).orderBy(warrantiesTable.createdAt);
  return res.json(warranties.map(w => ({ ...w, createdAt: w.createdAt.toISOString() })));
});

router.post("/admin/warranties", async (req, res) => {
  const parsed = AdminCreateWarrantyBody.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  const [warranty] = await db.insert(warrantiesTable).values(parsed.data).returning();
  return res.status(201).json({ ...warranty, createdAt: warranty.createdAt.toISOString() });
});

router.put("/admin/warranties/:id", async (req, res) => {
  const paramsParsed = AdminUpdateWarrantyParams.safeParse(req.params);
  const bodyParsed = AdminUpdateWarrantyBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) return res.status(400).json({ error: "Dữ liệu không hợp lệ" });
  const [warranty] = await db.update(warrantiesTable).set(bodyParsed.data).where(eq(warrantiesTable.id, paramsParsed.data.id)).returning();
  if (!warranty) return res.status(404).json({ error: "Không tìm thấy bảo hành" });
  return res.json({ ...warranty, createdAt: warranty.createdAt.toISOString() });
});

router.delete("/admin/warranties/:id", async (req, res) => {
  const parsed = AdminDeleteWarrantyParams.safeParse(req.params);
  if (!parsed.success) return res.status(400).json({ error: "ID không hợp lệ" });
  await db.delete(warrantiesTable).where(eq(warrantiesTable.id, parsed.data.id));
  return res.json({ success: true });
});

export default router;
