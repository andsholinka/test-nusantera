const {
    Sequelize
} = require('sequelize');
// const sequelize = require('sequelize');
const db = require("../config/db");

const Merchant = db.define(
    "Merchant", {
        merchant_id: {
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
        store_name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        role: {
            type: Sequelize.STRING,
            defaultValue: '1'
        },
        phone: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    }
);

Merchant.removeAttribute('id');
Merchant.associate = function (models) {
    // associations can be defined here
    Customer.belongsTo(models.Product, {
        foreignKey: 'user_id',
        as: 'token'
    })
};

module.exports = Merchant;