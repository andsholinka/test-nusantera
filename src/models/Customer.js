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
        role: {
            type: Sequelize.STRING,
            defaultValue: '0'
        },
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    }
);

Customer.removeAttribute('id');
Customer.associate = function (models) {
    // associations can be defined here
    Customer.belongsTo(models.Token, {
        foreignKey: 'customer_id',
        as: 'token'
    })
};

module.exports = Customer;