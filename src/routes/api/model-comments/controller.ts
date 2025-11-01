import { Router, Request, Response } from "express";
import Models from "../../../../db/sequelize";
import { ApiErrorMessages as E } from "../errors";
import { validateBody } from "../validate";
import { modelCommentService } from "../../../services";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
	try {
		const data = await modelCommentService.findAll();
		res.json(data);
	} catch (e) {
		res.status(500).json({ message: E.LIST_FAILED });
	}
});

router.get("/:id", async (req: Request, res: Response) => {
	try {
		const row = await modelCommentService.findById(req.params.id);
		if (!row) return res.status(404).json({ message: E.NOT_FOUND });
		res.json(row);
	} catch (e) {
		res.status(503).json({ message: E.DB_UNAVAILABLE });
	}
});

router.post("/", validateBody(Models.ModelComment as any, { partial: false }), async (req: Request, res: Response) => {
	try {
		const created = await modelCommentService.create(req.body);
		res.status(201).json(created);
	} catch (e) {
		res.status(400).json({ message: E.CREATE_FAILED });
	}
});

router.put("/:id", validateBody(Models.ModelComment as any, { partial: true }), async (req: Request, res: Response) => {
	try {
		const updated = await modelCommentService.update(req.params.id, req.body);
		if (!updated) return res.status(404).json({ message: E.NOT_FOUND });
		res.json(updated);
	} catch (e) {
		res.status(400).json({ message: E.UPDATE_FAILED });
	}
});

router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const deleted = await modelCommentService.delete(req.params.id);
		if (!deleted) return res.status(404).json({ message: E.NOT_FOUND });
		res.status(204).send();
	} catch (e) {
		res.status(400).json({ message: E.DELETE_FAILED });
	}
});

export default router;
