import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const warrantiesTable = pgTable("warranties", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  productName: text("product_name").notNull(),
  serialNumber: text("serial_number"),
  purchaseDate: text("purchase_date").notNull(),
  warrantyEndDate: text("warranty_end_date").notNull(),
  status: text("status").notNull().default("active"),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertWarrantySchema = createInsertSchema(warrantiesTable).omit({ id: true, createdAt: true });
export type InsertWarranty = z.infer<typeof insertWarrantySchema>;
export type Warranty = typeof warrantiesTable.$inferSelect;
