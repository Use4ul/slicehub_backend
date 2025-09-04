const monitoringRouter = require('./controller');
const setupCpuMonitoring = require('./websocket');
const { monitoringEventLoop, getCoresInfo } = require('./service');

// Запускаем мониторинг Event Loop
setInterval(monitoringEventLoop, 100);

// Инициализируем начальные данные CPU
getCoresInfo();

module.exports = {
    monitoringRouter,
    setupCpuMonitoring
};