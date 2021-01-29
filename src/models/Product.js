const {
    Sequelize
} = require('sequelize');
// const sequelize = require('sequelize');
const db = require("../config/db");

const Product = db.define(
    "Product", {
        product_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            type: Sequelize.INTEGER
        },
        merchant_id: {
            type: Sequelize.INTEGER
        },
        name_product: {
            type: Sequelize.STRING
        },
        price_product: {
            type: Sequelize.INTEGER
        },
        category_product: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    }
);

Product.removeAttribute('id');
Product.associate = function (models) {
    // associations can be defined here
};

module.exports = Product;