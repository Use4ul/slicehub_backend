import * as http from 'http';

import express, { Express, Router, Request, Response, response } from 'express';

import conf from './conf.json';
import { mainLogger } from './sys/logger';
import { monitoringRouter, setupCpuMonitoring } from './src/routes/monitoring';
import initDB from './db/init';
import Models, {dbConnection} from './db/sequelize';

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

// Здесь объясвялем все нужные глобальные роутеры
const mainRouter = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// mainRouter.get('/city', async (req: Request, res: Response) => {
//     try {
//         const data = await Models.City.findAll({where: {id: 1}});
//         const value = data[0].id
//         const test = await dbConnection.query('SELECT * FROM roles')
//         console.log(test);
        
//         return res.status(200).json({data, roles: test})
//     } catch (error) {
        
//     }
// });

// Подключаем роут мониторинга
app.use('/monitoring', monitoringRouter);
app.use('/main', mainRouter);


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
