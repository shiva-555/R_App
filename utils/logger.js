'use strict';

const { format, createLogger, transports } = require('winston');
const { combine, timestamp, prettyPrint } = format;
require('winston-daily-rotate-file');

const rotation = new (transports.DailyRotateFile)({
    filename: 'recruitement-app-%DATE%.log',
    dirname: 'logs',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '3d'
});

const logger = createLogger({
    level: 'info',
    format: combine(
        format.splat(),
        format.simple(),
        timestamp(),
        prettyPrint()
    ),
    transports: [
       /* new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),*/
        rotation
    ],
    exitOnError: false
});

/*
If we're not in production then log to the `console` with the format:
`${info.level}: ${info.message} JSON.stringify({ ...rest }) `
*/

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.simple()
    }));
}

module.exports = logger;