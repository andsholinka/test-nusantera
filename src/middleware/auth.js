const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Token = require('../models/Token');
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

// Login 
authRouter.post('/login', async (req, res) => {

    const {
        error
    } = loginValidation(req.body)
    if (error) return res.status(400).json({
        status: res.statusCode,
        message: error.details[0].message
    })

    try {
        // if username exist
        const customer = await Customer.findOne({
            where: {
                email: req.body.email
            }
        })
        if (!customer) return res.status(400).json({
            status: res.statusCode,
            message: 'Email Anda Salah!'
        })

        // check password
        const validPwd = await bcrypt.compare(req.body.password, customer.password)
        if (!validPwd) return res.status(400).json({
            status: res.statusCode,
            message: 'Password Anda Salah!'
        })

        // token
        const token = jwt.sign({
            user_id: customer.customer_id
        }, process.env.SECRET_KEY, {
            expiresIn: 86400
        });
        const tokenData = {
            token: token,
            customer_id: customer.customer_id,
        };

        Token.update({
                customer_id: customer.customer_id,
                token: token
            }, {
                where: {
                    customer_id: customer.customer_id
                }
            })
            .then(data => {
                if (data[0] !== 0) {
                    res.status(200).send({
                        status: res.statusCode,
                        message: "Update Token",
                        token: token
                    });
                } else {
                    Token.create(tokenData)
                        .then(datatoken => {
                            res.status(201).send({
                                status: res.statusCode,
                                message: "Created Token",
                                token: datatoken.token
                            });
                        })
                }
            })
            .catch((error) => res.status(400).send(error));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            message: err.message
        });
    }
});

module.exports = authRouter;