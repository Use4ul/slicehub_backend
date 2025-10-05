import { Router, Request, Response } from "express";
import Models from "../../../db/sequelize";

type ModelKey = keyof typeof Models;

export function createListRouter(modelKey: ModelKey): Router {
	const router = Router();
	router.get("/", async (req: Request, res: Response) => {
		try {
			const rows = await (Models as any)[modelKey].findAll();
			res.json(rows);
		} catch (error) {
			res.status(500).json({ message: "Failed to fetch list" });
		}
	});
	return router;
}


