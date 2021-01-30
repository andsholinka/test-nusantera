const {
    Sequelize
} = require('sequelize');
// const sequelize = require('sequelize');
const db = require("../config/db");

const Driver = db.define(
    "Driver", {
        driver_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING
        },
        email: {
            unique: true,
            type: Sequelize.STRING
        },
        password: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING,
            defaultValue: '2'
        },
        license_plates: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    }
);

Driver.removeAttribute('id');
Driver.associate = function (models) {
    // associations can be defined here
    Driver.belongsTo(models.Token, {
        foreignKey: 'driver_id',
        as: 'token'
    })
};

module.exports = Driver;