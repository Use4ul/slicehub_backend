const conf = require('./conf.json');
const express = require('express');
const { mainLogger } = require('./sys/logger');
const initDB = require('./db/init');
const app = express();
const PORT = conf.settings.port || process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bootstrap = async () => {
    try {
        mainLogger.info(`Starting bootstrap func...`);
        startApp();
        await initDB();
        mainLogger.info('DB initialization complited successfully');
        mainLogger.info(`App is running...`);
    } catch (error) {
        mainLogger.error('APP STARTING ERROR:', error?.message);
    }
};

function startApp() {
    app.listen(PORT, () => {
        mainLogger.info(`App port:: ${PORT}`);
    });
}

bootstrap().catch((e) => `SOME BOOTSTRAP ERROR ${e?.message}`);
