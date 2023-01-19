'use strict';

const app = require('./app');
const db = require('./models/indexModel');
const logger = require('./utils/logger');

// Handling Uncaught Exception
process.on('uncaughtException', (e) => {
    logger.error('Error: ' + e.message);
    console.log('Shutting down the server due to Uncaught Exception');
    process.exit(1);
});

db.sequelize.authenticate().then(() => {
    db.sequelize.sync(
        // { alter: true }
    );
    console.log('Connection has been established successfully.');
}).catch((e) => {
    logger.error(e);
});

const server = app.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 5000, () => {
    console.log('Server is working on http://localhost:' + (process.env.NODE_ENV === 'production' ? process.env.PORT : 5000));
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (e) => {
    logger.error('Error: ' + e.message);
    console.log('Shutting down the server due to Unhandled Promise Rejection');
    server.close(() => {
        process.exit(1);
    });
});
