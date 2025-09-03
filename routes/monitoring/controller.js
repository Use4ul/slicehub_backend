const express = require('express');
const router = express.Router();
const monitorService = require('./service');
const { htmlPage } = require('./htmlReady');

// Health check endpoint
router.get('/healthcheck', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// Статическая страница мониторинга
router.get('/ui', (req, res) => {
    res.send(htmlPage);
});

module.exports = router;
