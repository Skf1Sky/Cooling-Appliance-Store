import { Router } from "express";
import { db, ordersTable, cartItemsTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";

const router = Router();

const SESSION_ID = "default-session";

router.post("/orders", async (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const sessionId = (req.cookies?.sessionId as string) || SESSION_ID;
  const { customerName, customerPhone, customerEmail, shippingAddress, note } = parsed.data;

  const cartItems = await db
    .select({
      quantity: cartItemsTable.quantity,
      price: productsTable.price,
    })
    .from(cartItemsTable)
    .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  if (cartItems.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const total = cartItems.reduce((sum, item) => sum + Number(item.price ?? 0) * item.quantity, 0);

  const [order] = await db
    .insert(ordersTable)
    .values({
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      note,
      total(total),
    })
    .returning();

  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

  return res.status(201).json({
    ...order,
    total(order.total),
    createdAt: order.createdAt.toISOString(),
  });
});

export default router;
