const {
    Sequelize
} = require('sequelize');
// const sequelize = require('sequelize');
const db = require("../config/db");

const Bucket = db.define(
    "Bucket", {
        bucket_id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            type: Sequelize.INTEGER
        },
        product_id: {
            type: Sequelize.STRING
        },
        qty: {
            type: Sequelize.INTEGER
        },
        note: {
            type: Sequelize.STRING
        },
    }, {
        freezeTableName: true
    }
);

Bucket.removeAttribute('id');
Bucket.associate = function (models) {
    // associations can be defined here
};

module.exports = Bucket;