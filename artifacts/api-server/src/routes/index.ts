import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import categoriesRouter from "./categories";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import authRouter from "./auth";
import adminRouter from "./admin";
import warrantyRouter from "./warranty";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(warrantyRouter);
router.use(productsRouter);
router.use(categoriesRouter);
router.use(cartRouter);
router.use(ordersRouter);

export default router;
