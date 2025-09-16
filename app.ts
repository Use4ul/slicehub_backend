import * as http from 'http';

import express, { Express } from 'express';

import conf from './conf.json';
import { monitoringRouter, setupCpuMonitoring } from './src/routes/monitoring';
import { mainLogger } from './sys/logger';
import initDB from './db/init';


interface Settings {
    port: number;
}

interface Configuration {
    settings: Settings;
}

const config: Configuration = conf as Configuration;

const app: Express = express();
const server = http.createServer(app);
const PORT = config.settings.port || parseInt(process.env.PORT || '3000', 10);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем роут мониторинга
app.use('/monitoring', monitoringRouter);

const bootstrap = async (): Promise<void> => {
    try {
        mainLogger.info(`Starting bootstrap func...`);
        startApp();
        await initDB();

        setupCpuMonitoring(server);
        mainLogger.info(
            '\n🏠 Monitoring:',
            `\nhttp://localhost:${PORT}/monitoring/ui`,
            `\nhttp://localhost:${PORT}/monitoring/healthcheck`
        );
    } catch (error) {
        const err = error as Error;
        mainLogger.error('APP STARTING ERROR:', err?.message);
    }
};

function startApp(): void {
    server.listen(PORT, () => {
        mainLogger.info(`App port:: ${PORT}`);
    });
}

bootstrap().catch((e: Error) => {
    mainLogger.error(`SOME BOOTSTRAP ERROR: ${e?.message}`);
    process.exit(1);
});
