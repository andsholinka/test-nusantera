const sequelize = require('sequelize');

const db = new sequelize("nusantera", "root", "", {
    dialect: "mysql"
});

db.sync({});

module.exports = db;