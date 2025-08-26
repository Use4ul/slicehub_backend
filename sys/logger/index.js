const log4js = require('log4js');
const path = require('path');

// default settings
const TODAY = '_' + new Date().toISOString().split('T')[0].replaceAll('-', '_') + '.log';
const type = 'file';
const maxLogSize = 5242880;
const backups = 7;
const layoutType = 'pattern';
const layoutPattern = '%d{|yyyy-MM-dd|hh:mm:ss.SSS|} [%p] %m';

log4js.configure({
    appenders: {
        console: { type: 'console' },
        main: {
            type,
            filename: path.join(__dirname, '../../logs/main' + TODAY),
            maxLogSize,
            backups,
            layout: {
                type: layoutType,
                pattern: layoutPattern,
            },
        },
        db: {
            type,
            filename: path.join(__dirname, '../../logs/db' + TODAY),
            maxLogSize,
            backups,
            layout: {
                type: layoutType,
                pattern: layoutPattern,
            },
        },
        sync: {
            type,
            filename: path.join(__dirname, '../../logs/sync' + TODAY),
            maxLogSize,
            backups,
            layout: {
                type: layoutType,
                pattern: layoutPattern,
            },
        },
    },
    categories: {
        default: { appenders: ['console', 'main'], level: 'info' },
        database: { appenders: ['db'], level: 'debug' },
        sync: { appenders: ['sync', 'console'], level: 'info' },
    },
});

module.exports = {
    mainLogger: log4js.getLogger(),
    loggerDB: log4js.getLogger('db'),
    syncLogger: log4js.getLogger('sync'),
};
