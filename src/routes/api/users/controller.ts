import { Router, Request, Response } from "express";
import Models from "../../../../db/sequelize";
import { ApiErrorMessages as E } from "../errors";
import { validateBody, getModelSchema } from "../validate";
import { userService } from "../../../services";
import { formatListResponse } from "../../../utils/response-formatter";

const router = Router();


router.get("/schema", (req: Request, res: Response) => {
	try {
		const schema = getModelSchema(Models.User as any);
		res.json(schema);
	} catch (e) {
		res.status(500).json({ message: "Failed to get schema" });
	}
});


router.get("/", async (req: Request, res: Response) => {
	try {
		// Пагинация: по умолчанию первые 50 записей
		const limit = parseInt(req.query.limit as string) || 50;
		const offset = parseInt(req.query.offset as string) || 0;
		
		const data = await userService.findAll({
			limit,
			offset,
			order: [['created_at', 'DESC']],
		});
		
		const total = await userService.count();
		
		res.json(formatListResponse(data, { limit, offset, total }));
	} catch (e) {
		res.status(500).json({ message: E.LIST_FAILED });
	}
});


router.get("/:id", async (req: Request, res: Response) => {
	try {
		const row = await userService.findById(req.params.id);
		if (!row) return res.status(404).json({ message: E.NOT_FOUND });
		res.json(row);
	} catch (e) {
		res.status(503).json({ message: E.DB_UNAVAILABLE });
	}
});

router.post("/", validateBody(Models.User as any, { partial: false, allowedFields: ['user_name', 'display_name', 'status_id'] }), async (req: Request, res: Response) => {
	try {
		const created = await userService.create(req.body);
		res.status(201).json(created);
	} catch (e) {
		res.status(400).json({ message: E.CREATE_FAILED });
	}
});

router.put("/:id", validateBody(Models.User as any, { partial: true, allowedFields: ['user_name', 'display_name', 'status_id'] }), async (req: Request, res: Response) => {
	try {
		const updated = await userService.update(req.params.id, req.body);
		if (!updated) return res.status(404).json({ message: E.NOT_FOUND });
		res.json(updated);
	} catch (e) {
		res.status(400).json({ message: E.UPDATE_FAILED });
	}
});

router.delete("/:id", async (req: Request, res: Response) => {
	try {
		const deleted = await userService.delete(req.params.id);
		if (!deleted) return res.status(404).json({ message: E.NOT_FOUND });
		res.status(204).send();
	} catch (e) {
		res.status(400).json({ message: E.DELETE_FAILED });
	}
});

export default router;
