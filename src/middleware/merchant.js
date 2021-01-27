const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Merchant = require('../models/Merchant');
// const Token = require('../models/Token');
require('dotenv/config')

const {
    registerValidation,
    loginValidation
} = require('../config/validation')

var merchantRouter = express.Router();

merchantRouter.use(bodyParser.urlencoded({
    extended: false
}));
merchantRouter.use(bodyParser.json());

// Register 
merchantRouter.post('/register', async (req, res) => {

    try {
        const {
            email,
            name,
            password,
            store_name,
            address,
        } = req.body;

        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(password, saltRounds);

        const emailDuplicate = await Merchant.findOne({
            where: {
                email: email
            }
        })

        if (emailDuplicate) {
            res.status(400).json({
                status: res.statusCode,
                message: 'This email already exist'
            });
        } else {
            const created = await Merchant.create({
                email: email,
                password: hashedPw,
                name: name,
                store_name: store_name,
                address: address
            })

            res.json(created);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = merchantRouter;