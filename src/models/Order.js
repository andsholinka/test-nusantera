const {
    Sequelize
} = require('sequelize');
// const sequelize = require('sequelize');
const db = require("../config/db");

const Order = db.define(
    "Order", {
        order_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            type: Sequelize.INTEGER
        },
        customer_name: {
            type: Sequelize.STRING
        },
        customer_phone: {
            type: Sequelize.STRING
        },
        customer_address: {
            type: Sequelize.STRING
        },
        bucket_id: {
            type: Sequelize.STRING
        },
        qty: {
            type: Sequelize.INTEGER
        },
        note: {
            type: Sequelize.STRING
        },
        store_name: {
            type: Sequelize.STRING
        },
        merchant_address: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    }
);

Order.removeAttribute('id');
Order.associate = function (models) {
    // associations can be defined here
};

module.exports = Order;