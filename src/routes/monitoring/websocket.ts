import * as http from 'http';

import WebSocket from 'ws';

import conf from '../../../conf.json';
import { mainLogger } from '../../../sys/logger';

import * as monitorService from './service';

const reqInterval = (conf as any).monitoringSettings?.reqInterval || 1000;

export default function setupCpuMonitoring(server: http.Server): void {
    const wss = new WebSocket.Server({ server, path: '/ws/cpu' });

    wss.on('connection', (ws: WebSocket) => {
        mainLogger.info('Client connected to CPU monitor');
        const interval = setInterval(() => {
            try {
                const data = monitorService.getMonitorData();
                ws.send(JSON.stringify({ type: 'cpu_usage', data }));
            } catch (error) {
                mainLogger.error('Error sending WebSocket data:', (error as Error).message);
            }
        }, reqInterval);

        ws.on('close', () => {
            mainLogger.info('Client disconnected from CPU monitor');
            clearInterval(interval);
        });

        ws.on('error', (error: Error) => {
            mainLogger.error('WebSocket error:', error.message);
            clearInterval(interval);
        });

        ws.send(
            JSON.stringify({
                type: 'connected',
                message: 'Connected to CPU monitor',
                timestamp: new Date().toISOString(),
            })
        );
    });

    wss.on('error', (error: Error) => {
        mainLogger.error('WebSocket server error:', error.message);
    });

    mainLogger.info('WebSocket CPU monitor initialized');
}
