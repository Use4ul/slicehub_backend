import { Router, Request, Response } from 'express';

import { htmlPage } from './htmlReady';

const router = Router();

// Health check endpoint
router.get('/healthcheck', (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Статическая страница мониторинга
router.get('/ui', (req: Request, res: Response) => {
    res.send(htmlPage);
});

export default router;
