import { Router, Request, Response } from 'express';

import { htmlPage } from './htmlReady';

import Models from '../../../db/sequelize';

const router = Router();

// Health check endpoint
router.get('/healthcheck', async (req: Request, res: Response) => {
    const data = await Models.Users.findAll()
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        testData: data
    });
});

// Статическая страница мониторинга
router.get('/ui', (req: Request, res: Response) => {
    res.send(htmlPage);
});

export default router;
