const {
    Sequelize
} = require('sequelize');
// const sequelize = require('sequelize');
const db = require("../config/db");

const Token = db.define(
    "Token", {
        token_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        customer_id: {
            type: Sequelize.INTEGER
        },
        merchant_id: {
            type: Sequelize.INTEGER
        },
        driver_id: {
            type: Sequelize.INTEGER
        },
        token: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    }
);

Token.removeAttribute('id');
Token.associate = function (models) {
    // associations can be defined here
};

module.exports = Token;