const conf = require('./conf.json');
const express = require('express');
const http = require('http');
const { mainLogger } = require('./sys/logger');
const initDB = require('./db/init');

// Импортируем мониторинг
const { monitoringRouter, setupCpuMonitoring } = require('./routes/monitoring');

const app = express();
const server = http.createServer(app);
const PORT = conf.settings.port || process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем роут мониторинга
app.use('/monitoring', monitoringRouter);

const bootstrap = async () => {
    try {
        mainLogger.info(`Starting bootstrap func...`);
        startApp();
        // await initDB();

        setupCpuMonitoring(server);
        mainLogger.info(
            '\n',
            '🏠 Monitoring:',
            '\n',
            `http://localhost:${PORT}/monitoring/ui`,
            '\n',
            `http://localhost:${PORT}/monitoring/healthcheck`
        );
    } catch (error) {
        mainLogger.error('APP STARTING ERROR:', error?.message);
    }
};

function startApp() {
    server.listen(PORT, () => {
        mainLogger.info(`App port:: ${PORT}`);
    });
}

bootstrap().catch((e) => {
    mainLogger.error(`SOME BOOTSTRAP ERROR: ${e?.message}`);
    process.exit(1);
});
