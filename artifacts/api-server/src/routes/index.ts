import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import productsRouter from "./products.js";
import categoriesRouter from "./categories.js";
import cartRouter from "./cart.js";
import ordersRouter from "./orders.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";
import warrantyRouter from "./warranty.js";
import statsRouter from "./stats.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(statsRouter);
router.use(warrantyRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(cartRouter);
router.use(ordersRouter);

export default router;
