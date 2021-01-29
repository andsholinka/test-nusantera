const express = require('express');
const bodyParser = require('body-parser');
const Order = require('../models/Order');
require('dotenv/config')

var orderRouter = express.Router();

orderRouter.use(bodyParser.urlencoded({
    extended: false
}));
orderRouter.use(bodyParser.json());

// getAllOrder
orderRouter.get('/', async (req, res) => {
    try {
        const order = await Order.findAll({})
        res.json(order);
        // console.log(User)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = orderRouter;