import { Router } from "express";
import { db, warrantiesTable } from "@workspace/db";
import { ilike } from "drizzle-orm";

const router = Router();

router.get("/warranty/check", async (req, res) => {
  const phone = req.query.phone as string;
  if (!phone || phone.trim().length < 9) {
    return res.status(400).json({ error: "Số điện thoại không hợp lệ" });
  }

  const results = await db
    .select()
    .from(warrantiesTable)
    .where(ilike(warrantiesTable.phone, `%${phone.trim()}%`));

  res.json(results.map(w => ({
    ...w,
    createdAt: w.createdAt.toISOString(),
  })));
});

export default router;
