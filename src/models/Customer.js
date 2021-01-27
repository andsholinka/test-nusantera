const {
    Sequelize
} = require('sequelize');
// const sequelize = require('sequelize');
const db = require("../config/db");

const Customer = db.define(
    "Customer", {
        customer_id: {
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
    }, {
        freezeTableName: true
    }
);

Customer.sync({});

module.exports = Customer;