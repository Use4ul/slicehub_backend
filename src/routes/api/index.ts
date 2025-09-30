import { Router } from "express";

import categoriesRouter from "./categories/controller";

const router = Router();

router.use("/categories", categoriesRouter);

export default router;
