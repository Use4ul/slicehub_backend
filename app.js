const conf = require('./config.json');
const express = require('express');
const { mainLogger } = require('./sys/logger/logger');
const app = express();
const PORT = conf.app.port || gprocess.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bootstrap = async () => {
    try {
        mainLogger.info(`Starting bootstrap func...`);
        startApp();
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
