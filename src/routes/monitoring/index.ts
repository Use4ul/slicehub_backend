import monitoringRouter from './controller';
import setupCpuMonitoring from './websocket';
import { monitoringEventLoop, getCoresInfo } from './service';

// Запускаем мониторинг Event Loop
setInterval(monitoringEventLoop, 100);

// Инициализируем начальные данные CPU
getCoresInfo();

export { monitoringRouter, setupCpuMonitoring };
