'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes, Op } = require('sequelize');
const basename = path.basename(module.filename);
const db = {};

let sequelize;
if (process.env.NODE_ENV === 'production') {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
        dialect: 'mysql'
    });
} else {
    sequelize = new Sequelize('recruiter_app_test', 'root', 'root', {
        logging: console.log,
        dialect: 'mysql'
    });
}

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function (file) {
        if (file.slice(-3) !== '.js') return;
        const model = require(path.join(__dirname, file))(sequelize, Sequelize, DataTypes);
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;

module.exports = db;