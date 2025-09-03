const WebSocket = require('ws');
const { mainLogger } = require('../../sys/logger');
const monitorService = require('./service');

function setupCpuMonitor(server) {
    const wss = new WebSocket.Server({ server, path: '/ws/cpu' });

    wss.on('connection', (ws) => {
        mainLogger.info('Client connected to CPU monitor');

        const interval = setInterval(() => {
            try {
                const data = monitorService.getMonitorData();

                ws.send(
                    JSON.stringify({
                        type: 'cpu_usage',
                        data: data,
                    })
                );
            } catch (error) {
                mainLogger.error('Error sending WebSocket data:', error.message);
            }
        }, 1000);

        ws.on('close', () => {
            mainLogger.info('Client disconnected from CPU monitor');
            clearInterval(interval);
        });

        ws.on('error', (error) => {
            mainLogger.error('WebSocket error:', error.message);
            clearInterval(interval);
        });

        // Отправляем приветственное сообщение
        ws.send(
            JSON.stringify({
                type: 'connected',
                message: 'Connected to CPU monitor',
                timestamp: new Date().toISOString(),
            })
        );
    });

    wss.on('error', (error) => {
        mainLogger.error('WebSocket server error:', error.message);
    });

    mainLogger.info('WebSocket CPU monitor initialized');
    return wss;
}

module.exports = setupCpuMonitor;
