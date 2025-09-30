import { Router, Request, Response } from "express";
import Models from "../../../../db/sequelize";

const router = Router();

router.get("/categories", async (req: Request, res: Response) => {
    const data = await Models.ModelCategory.findAll();
    res.json(data);
});

export default router;
