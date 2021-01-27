const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
// const Token = require('../models/Token');
require('dotenv/config')

const {
    registerValidation,
    loginValidation
} = require('../config/validation')

var authRouter = express.Router();

authRouter.use(bodyParser.urlencoded({
    extended: false
}));
authRouter.use(bodyParser.json());

// Register 
authRouter.post('/register', async (req, res) => {

    const {
        error
    } = registerValidation(req.body)
    if (error) return res.status(400).json({
        status: res.statusCode,
        message: error.details[0].message
    })

    try {
        const {
            email,
            name,
            password,
        } = req.body;

        const saltRounds = 10;
        const hashedPw = await bcrypt.hash(password, saltRounds);

        const emailDuplicate = await Customer.findOne({
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
            const created = await Customer.create({
                email: email,
                password: hashedPw,
                name: name
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

module.exports = authRouter;