import { Router } from "express";

const router = Router();

router.get("/healthz", async (req, res) => {
  return res.json({ status: "ok" });
});

export default router;
