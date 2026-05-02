import { pgTable, serial, text, numeric, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  brand: text("brand").notNull(),
  categoryId: integer("category_id").notNull(),
  price: numeric("price", { precision: 15, scale: 0 }).notNull(),
  originalPrice: numeric("original_price", { precision: 15, scale: 0 }),
  discountPercent: integer("discount_percent"),
  imageUrl: text("image_url"),
  images: jsonb("images").$type<string[]>().default([]),
  description: text("description"),
  specs: jsonb("specs").$type<Record<string, string>>().default({}),
  condition: text("condition").default("new"),
  isFeatured: boolean("is_featured").default(false),
  inStock: boolean("in_stock").default(true),
  rating: numeric("rating", { precision: 2, scale: 1 }),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
