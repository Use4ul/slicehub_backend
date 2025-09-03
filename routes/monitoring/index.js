const router = require('./controller');
const setupCpuMonitor = require('./websocket');
const monitorService = require('./service');

// Запускаем мониторинг Event Loop
setInterval(monitorService.monitorEventLoop, 100);

// Инициализируем начальные данные CPU
monitorService.getCoresInfo();

module.exports = {
    monitoringRouter: router,
    setupCpuMonitor,
    monitorService,
};
