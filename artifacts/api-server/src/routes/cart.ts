import { Router } from "express";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { AddToCartBody, UpdateCartItemBody, UpdateCartItemParams, RemoveCartItemParams } from "@workspace/api-zod";

const router = Router();

const SESSION_ID = "default-session";

async function getCartData(sessionId: string) {
  const items = await db
    .select({
      id: cartItemsTable.id,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      productName: productsTable.name,
      productImageUrl: productsTable.imageUrl,
      price: productsTable.price,
    })
    .from(cartItemsTable)
    .leftJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  const cartItems = items.map(item => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName ?? "",
    productImageUrl: item.productImageUrl ?? undefined,
    price: Number(item.price ?? 0),
    quantity: item.quantity,
    subtotal: Number(item.price ?? 0) * item.quantity,
  }));

  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return { items: cartItems, total, itemCount };
}

router.get("/cart", async (req, res) => {
  const sessionId = (req.cookies?.sessionId as string) || SESSION_ID;
  const cart = await getCartData(sessionId);
  res.json(cart);
});

router.post("/cart/items", async (req, res) => {
  const parsed = AddToCartBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const sessionId = (req.cookies?.sessionId as string) || SESSION_ID;
  const { productId, quantity } = parsed.data;

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity, updatedAt: new Date() })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({ sessionId, productId, quantity });
  }

  const cart = await getCartData(sessionId);
  res.json(cart);
});

router.put("/cart/items/:itemId", async (req, res) => {
  const paramsParsed = UpdateCartItemParams.safeParse(req.params);
  const bodyParsed = UpdateCartItemBody.safeParse(req.body);

  if (!paramsParsed.success || !bodyParsed.success) {
    return res.status(400).json({ error: "Invalid request" });
  }

  const sessionId = (req.cookies?.sessionId as string) || SESSION_ID;
  const { itemId } = paramsParsed.data;
  const { quantity } = bodyParsed.data;

  if (quantity <= 0) {
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, itemId));
  } else {
    await db
      .update(cartItemsTable)
      .set({ quantity, updatedAt: new Date() })
      .where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.sessionId, sessionId)));
  }

  const cart = await getCartData(sessionId);
  res.json(cart);
});

router.delete("/cart/items/:itemId", async (req, res) => {
  const parsed = RemoveCartItemParams.safeParse(req.params);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid item ID" });
  }

  const sessionId = (req.cookies?.sessionId as string) || SESSION_ID;
  await db
    .delete(cartItemsTable)
    .where(and(eq(cartItemsTable.id, parsed.data.itemId), eq(cartItemsTable.sessionId, sessionId)));

  const cart = await getCartData(sessionId);
  res.json(cart);
});

export default router;
