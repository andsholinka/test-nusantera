const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');

var userRouter = express.Router();

userRouter.use(bodyParser.urlencoded({
    extended: false
}));
userRouter.use(bodyParser.json());

// getAllCustomers
userRouter.get('/', async (req, res) => {
    try {
        const getAllUser = await Customer.findAll({})
        res.json(getAllUser);
        // console.log(User)
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = userRouter;